﻿using Backend.Data;
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

        private readonly IHttpClientFactory _clientFactory;
        private UserManager<IdentityUser> _userManager;
        public readonly IWebHostEnvironment _env;
        private string AdminRole = "Administrator";
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly string? baseUrl;
        private static string MainDirectory = Environment.CurrentDirectory;
        public DataContext dataContext;
        public DataRepository dataRepository;
        public MusicController(IHttpClientFactory clientFactory, 
            UserManager<IdentityUser> userManager, 
            IWebHostEnvironment env, 
            IServer server, 
            RoleManager<IdentityRole> _roleManager, DataContext _dataContext)
        {
            _clientFactory = clientFactory;
            _userManager = userManager;
            _env = env;
            baseUrl = server.Features.Get<IServerAddressesFeature>()?.Addresses.FirstOrDefault();
            roleManager = _roleManager;
            dataContext = _dataContext;
            dataRepository = new DataRepository(_dataContext);
        }

        [HttpGet("MusicFileArg"), AllowAnonymous]
        public async Task<IActionResult> GetMusic(string fileGetCode)
        {
            var songData = dataRepository.GetMusic(fileGetCode);
            Console.WriteLine("SongData get here");
            if (songData is null)
            {
                // Handle the case when songData is null
                return NotFound();
            }

            var isUserLoggedIn = IsUserLoggedIn();

            var musicPath = GetMusicPath(songData.AlbumId, fileGetCode);

            byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(musicPath);

            if (!isUserLoggedIn)
            {
                Console.WriteLine("User not logged in");
                fileBytes = GetPreview(fileBytes);
            }

            var fileResult = CreateFileResult(fileBytes, songData?.songName ?? string.Empty);
            return fileResult;
        }

        //Currently only returns mp3
        [HttpGet("MusicFileArgDownload"), AllowAnonymous]
        public async Task<IActionResult> GetMusicDownload(string fileGetCode)
        {
            var songData = dataRepository.GetMusic(fileGetCode);

            if (songData is null)
            {
                // Handle the case when songData is null
                return NotFound();
            }

            var isUserLoggedIn = IsUserLoggedIn();

            var musicPath = GetMusicPath(songData.AlbumId, fileGetCode);

            byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(musicPath);

            if (!isUserLoggedIn)
            {
                fileBytes = GetPreview(fileBytes);
            }
            
            return File(fileBytes, "audio/mpeg", $"{songData.songName}.mp3");
        }

        [HttpGet("GrabAlbums"), AllowAnonymous]
        public string GetAlbums()
        {
            // IF user is logged in, get albums with price that reflects previous purchases
            string jsonResult = JsonConvert.SerializeObject(dataRepository.GetAlbums(baseUrl!));
            return jsonResult;
        }

        [HttpGet("GetUserAlbums")]
        public async Task<string> GetUserAlbums()
        {
            var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine("User ID: " + userId);
            if (userId is null)
            {
                return "[]";
            }
            var userAlbums = await dataRepository.GetUserAlbums(userId);
            string jsonResult = JsonConvert.SerializeObject(userAlbums);
            return jsonResult;
        }

        [HttpGet("GetUserSongs")]
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

        private static string GetMusicPath(string albumId, string fileGetCode)
        {
            return Path.Combine(MainDirectory, $"Music/{albumId}/mp3/{fileGetCode}.mp3");
        }

        private static byte[] GetPreview(byte[] fileBytes)
        {
            Console.WriteLine("Getting preview");
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
