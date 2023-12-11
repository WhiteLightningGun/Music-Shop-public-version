using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IHttpClientFactory _clientFactory;
        private UserManager<IdentityUser> _userManager;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IHttpClientFactory clientFactory, UserManager<IdentityUser> userManager)
        {
            _logger = logger;
            _clientFactory = clientFactory;
            _userManager = userManager;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpGet("Hello")]
        public async Task<string> Hello()
        {
            var userEmail = await GetUserEmail();
            return $"hello, 1: {userEmail}";
        }

        //fix everything
        private async Task<string> GetUserEmail()
        {
            var request = new HttpRequestMessage(
                HttpMethod.Get, "https://localhost:7158/manage/info"); 
            request.Headers.Add("Authorization", Request.Headers.Authorization.First()); 

            var client = _clientFactory.CreateClient();

            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var jsonContent = await response.Content.ReadAsStringAsync();
                var user = JsonSerializer.Deserialize<User>(jsonContent,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                if(user != null)
                {
                    var userId = await _userManager.FindByEmailAsync(user.email);
                    var userIdB = userId?.Id;
                    return $"Hello, {user.email} - Id: {userIdB}";
                }
            }
            return "Something went wrong"; 
        }

    }
}
