using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using static System.IO.Path;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using System.Text.Encodings.Web;
using System.Text;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Backend.Repository;
using System.Text.Json.Nodes;
using System.Net.Http.Headers;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly string? _clientId;
        private readonly string? _clientSecret;
        public readonly string? clientUrl;
        private readonly string _payPalTokenUrl ="https://api-m.sandbox.paypal.com/v1/oauth2/token"; 
        private readonly string _payPalUrl = "https://api-m.sandbox.paypal.com";
        public PaymentsController(IConfiguration configuration)
        {
            _clientId = configuration["PayPal:ClientId"];
            _clientSecret = configuration["PayPal:ClientSecret"];
            clientUrl = configuration["ClientURL"];

        }
        [AllowAnonymous]
        [HttpGet("TestOne")]
        public string TestOne()
        {
            var accessToken = GetPaypalAccessToken();
            return $"Your access token is: {accessToken}";
        }

        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest orderRequest)
        {
            Console.WriteLine(orderRequest.Cart);
            Console.WriteLine($"User: {GetUserEmailFromClaims()}");
            //Perform data integrity check here, it should be impossible for the user to buy a song which doesn't exist or has already purchased

            var accessToken = GetPaypalAccessToken();

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var createOrderRequest = new HttpRequestMessage(HttpMethod.Post, _payPalUrl + "/v2/checkout/orders");

                var order = new
                {
                    intent = "CAPTURE",
                    purchase_units = orderRequest.Cart?.Select(cartItem => new
                    {
                        reference_id = Guid.NewGuid().ToString(),
                        amount = new
                        {
                            currency_code = "GBP",
                            cartItem.value, // Assuming the quantity is the price
                            breakdown = new
                            {
                                item_total = new
                                {
                                    currency_code = "GBP",
                                    cartItem.value // Assuming the quantity is the price
                                }
                            }
                        },
                        items = new[] // Add this array
                        {
                            new
                            {
                                name = $"song name 123, {cartItem.Id}", // Add this line
                                sku = cartItem.Id, // Add this line
                                unit_amount = new
                                {
                                    currency_code = "GBP",
                                    cartItem.value // Assuming the quantity is the price
                                },
                                quantity = '1' // Replace with the actual quantity
                            },
                        }
                    }).ToArray()
                };

                createOrderRequest.Content = new StringContent(JsonConvert.SerializeObject(order), Encoding.UTF8, "application/json");

                var response = await client.SendAsync(createOrderRequest);

                if (response.IsSuccessStatusCode)
                {
                    // Here is the point where we add an unconfirmed order to the DB, with form Paypal order ID, user ID, user Email, cart contents, and total price
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var createdOrder = JsonConvert.DeserializeObject<dynamic>(responseContent);
                    Console.WriteLine(createdOrder);
                    return Ok(responseContent);
                }
                else
                {
                    Console.WriteLine(response.Content.ReadAsStringAsync().Result);
                    return BadRequest("Failed to create order");
                }
            }
        }

        [AllowAnonymous]
        [HttpPost("capture-paypal-order")]
        public async Task<IActionResult> CaptureOrder([FromBody] OrderCaptureRequest request)
        {
            Console.WriteLine("Capture Order Request Received: " + request.orderID);
            var orderId = request.orderID;
            var accessToken = GetPaypalAccessToken();

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

                var captureOrderRequest = new HttpRequestMessage(HttpMethod.Post, _payPalUrl + "/v2/checkout/orders/" + orderId + "/capture");
                captureOrderRequest.Content = new StringContent("", null, "application/json");

                var response = await client.SendAsync(captureOrderRequest);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    // Parse the response and return the result
                    // This depends on the structure of your response
                    Console.WriteLine("Order Captured: " + responseContent);
                    return Ok(responseContent);
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Failed to capture order. Response: " + errorContent);   
                    return BadRequest("Failed to capture order");
                }
            }
        }

        private string GetPaypalAccessToken()
        {
            string accessToken = "";
            string url = _payPalTokenUrl;

            using (var client = new HttpClient())
            {
                string credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"));
                client.DefaultRequestHeaders.Add("Authorization", $"Basic {credentials}");
                var requestMessage = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = new StringContent("grant_type=client_credentials", null, "application/x-www-form-urlencoded")
                };

                var responseTask = client.SendAsync(requestMessage);
                responseTask.Wait();
                var result = responseTask.Result;

                if(result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsStringAsync();
                    readTask.Wait();
                    var strResponse = readTask.Result; // There's lots of interesting data here, remember for later...
                    //Console.WriteLine(strResponse);
                    var jsonResponse = JsonNode.Parse(strResponse);

                    if(jsonResponse != null)
                    {
                        accessToken = jsonResponse["access_token"]?.ToString() ?? "no token";
                    }
     
                }
                else
                {
                    Console.WriteLine(result.StatusCode);
                    //Console.WriteLine(result.Content.ReadAsStringAsync().Result);
                }

                return accessToken;
            }
        }

        private string? GetUserEmailFromClaims()
        {
            var emailClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            return emailClaim?.Value;
        }


    }
}