using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using static System.IO.Path;
using Newtonsoft.Json;
using Backend.Repository;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MusicController : ControllerBase
    {

        public readonly IWebHostEnvironment _env;
        private string AdminRole = "Administrator";
        private readonly string? baseUrl;
        private static string MainDirectory = Environment.CurrentDirectory;
        public DataContext dataContext;
        public DataRepository dataRepository;
        public MusicController(
            IWebHostEnvironment env, 
            IServer server, 
            DataContext _dataContext)
        {
            _env = env;
            baseUrl = server.Features.Get<IServerAddressesFeature>()?.Addresses.FirstOrDefault();
            dataContext = _dataContext;
            dataRepository = new DataRepository(_dataContext);
        }

        [HttpGet("MusicFileArg"), AllowAnonymous]
        public async Task<IActionResult> GetMusic(string fileGetCode)
        {
            var songData = dataRepository.GetMusic(fileGetCode);
            if (songData is null)
            {
                // Handle the case when songData is null
                return NotFound();
            }

            var isUserLoggedIn = IsUserLoggedIn();
            var userId = GetUserId();
            var isUserAdmin = IsUserAdmin();
            var userHasMusicPurchased = await dataRepository.HasUserPurchased(userId, fileGetCode);

            var musicPath = GetMusicPath(songData.AlbumId, fileGetCode);

            byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(musicPath);

            if(isUserAdmin || userHasMusicPurchased)
            {
                var fileResultAdmin = CreateFileResult(fileBytes, songData?.songName ?? string.Empty);
                return fileResultAdmin;
            }
            else
            {
                fileBytes = GetAudioPreview(fileBytes);
                var fileResult = CreateFileResult(fileBytes, songData?.songName ?? string.Empty);
                return fileResult;
            }

        }

        //Currently only returns mp3
        [HttpGet("MusicFileArgDownload")]
        public async Task<IActionResult> GetMusicDownload(string fileGetCode)
        {
            //First check if user actually has permission to download this file
            var userId = GetUserId();
            var isUserAdmin = IsUserAdmin();
            var userHasMusicPurchased = await dataRepository.HasUserPurchased(userId, fileGetCode);

            var songData = dataRepository.GetMusic(fileGetCode);

            if (songData is null)
            {
                // Handle the case when songData is null
                return NotFound();
            }

            var musicPath = GetMusicPath(songData.AlbumId, fileGetCode);
            byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(musicPath);

            if(isUserAdmin)
            {
                return File(fileBytes, "audio/mpeg", $"{songData.songName}.mp3");
            }
            else if(userHasMusicPurchased)
            {
                return File(fileBytes, "audio/mpeg", $"{songData.songName}.mp3");
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpGet("GrabAlbums"), AllowAnonymous]
        public string GetAlbums()
        {
            // IF user is logged in, get albums with price that reflects previous purchases
            string jsonResult = JsonConvert.SerializeObject(dataRepository.GetAlbums(baseUrl!));
            return jsonResult;
        }

        [HttpGet("GetUserAlbums"), AllowAnonymous]
        public async Task<string> GetUserAlbums()
        {
            var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userId is null)
            {
                return "[]";
            }
            var userAlbums = await dataRepository.GetUserAlbums(userId);
            string jsonResult = JsonConvert.SerializeObject(userAlbums);
            return jsonResult;
        }

        [HttpGet("GetUserSongs"), AllowAnonymous]
        public async Task<string> GetUserSongs()
        {
            var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userId is null)
            {
                return "[]";
            }
            var userSongs = await dataRepository.GetUserSongs(userId);
            string jsonResult = JsonConvert.SerializeObject(userSongs);
            return jsonResult;   
        }

        private bool IsUserLoggedIn()
        {
            if(HttpContext.User.Claims.Any())
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private bool IsUserAdmin()
        {
            if(HttpContext.User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == AdminRole))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private string GetUserId()
        {
            var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            return userId ?? "";
        }

        private static string GetMusicPath(string albumId, string fileGetCode)
        {
            return Path.Combine(MainDirectory, $"Music/{albumId}/mp3/{fileGetCode}.mp3");
        }

        /// <summary>
        /// Gets a preview of the song by returning the first 10% of the audio file bytes
        /// </summary>
        /// <param name="fileBytes"></param>
        /// <returns></returns>
        private static byte[] GetAudioPreview(byte[] fileBytes)
        {
            var previewLength = fileBytes.Length / 10;
            return new ArraySegment<byte>(fileBytes, 0, previewLength).ToArray();
        }

        private FileResult CreateFileResult(byte[] fileBytes, string songName)
        {
            var fileResult = File(fileBytes, "audio/mpeg", $"{songName}.mp3");
            fileResult.EnableRangeProcessing = true;
            return fileResult;
        }
    }
}
