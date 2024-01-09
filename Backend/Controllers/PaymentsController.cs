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
using Backend.Services;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        public DataContext dataContext;
        public DataRepository dataRepository;
        private readonly string? _clientId;
        private readonly string? _clientSecret;
        public readonly string? clientUrl;
        public IEmailSender emailSender;
        private readonly string _payPalTokenUrl;
        private readonly string _payPalUrl;
        public PaymentsController(IConfiguration configuration, DataContext _dataContext, IEmailSender _emailSender)
        {
            _clientId = configuration["PayPal:ClientId"];
            _clientSecret = configuration["PayPal:ClientSecret"];
            clientUrl = configuration["ClientURL"];
            _payPalTokenUrl = configuration["PaypalTokenURL"]!;
            _payPalUrl = configuration["PaypalURL"]!;
            dataContext = _dataContext;
            dataRepository = new DataRepository(_dataContext);
            emailSender = _emailSender; 
        }

        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest orderRequest)
        {
            string userEmailFromClaims = GetUserEmailFromClaims() ?? "";
            string userIDFromClaims = GetUserID() ?? "";
            //Perform data integrity check here, it should be impossible for the user to buy a song which doesn't exist or has already purchased
            if (!await dataRepository.CheckCartIntegrity(orderRequest.Cart!, userIDFromClaims))
            {
                return BadRequest("cart integrity check failed");
            }

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
                            cartItem.value, // Price of the item
                            breakdown = new
                            {
                                item_total = new
                                {
                                    currency_code = "GBP",
                                    cartItem.value // Price of the item
                                }
                            }
                        },
                        items = new[] // Add this array
                        {
                            new
                            {
                                name = $"{cartItem.Id}", // Add this line
                                sku = $"ET-Audio", // Add this line
                                unit_amount = new
                                {
                                    currency_code = "GBP",
                                    cartItem.value // Price of the item
                                },
                                quantity = '1' // This will always be one in the case of digital music files
                            },
                        }
                    }).ToArray()
                };

                createOrderRequest.Content = new StringContent(JsonConvert.SerializeObject(order), Encoding.UTF8, "application/json");

                var response = await client.SendAsync(createOrderRequest);

                if (response.IsSuccessStatusCode && orderRequest.Cart is not null)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var createdOrder = JsonConvert.DeserializeObject<dynamic>(responseContent);

                    List<string?> productsList = orderRequest.Cart.Select(item => item.productID?.ToString()).ToList();
                    string paypalOrderId = createdOrder?.id.ToString() ?? "no order id";  
                    await dataRepository.AddPaypalOrder(paypalOrderId, userIDFromClaims, productsList!);
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

        [HttpPost("capture-paypal-order")]
        public async Task<IActionResult> CaptureOrder([FromBody] OrderCaptureRequest request)
        {
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
                    // send confirmation email
                    await dataRepository.CompletePaypalOrder(orderId!);
                    string userEmail = await dataRepository.GetUserEmailFromPaypalOrderID(orderId!);
                    string musicList = await dataRepository.GetMusicListFromPaypalOrder(orderId!); 
                    await emailSender.SendOrderConfirmation(userEmail, orderID: orderId!, musicList: [.. musicList.Split(',')]);
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
                }

                return accessToken;
            }
        }

        private string? GetUserEmailFromClaims()
        {
            var emailClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            return emailClaim?.Value;
        }

        private string? GetUserID()
        {
            var userIDClaim = User.Claims.FirstOrDefault( c => c.Type == ClaimTypes.NameIdentifier);
            return userIDClaim?.Value;
        }
    }
}