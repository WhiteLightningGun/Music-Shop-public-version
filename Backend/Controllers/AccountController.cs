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
using Backend.Services;



namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private UserManager<IdentityUser> _userManager;
        public readonly IWebHostEnvironment _env;
        private string AdminRole = "Administrator";
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly string? baseUrl;
        private static string MainDirectory = Environment.CurrentDirectory;
        private readonly IWebHostEnvironment _hostEnvironment;
        public DataContext dataContext;
        public SignInManager<IdentityUser> _signInManager;
        public IEmailSender<IdentityUser> emailSender;
        public DataRepository dataRepository;
        public AccountController(IHttpClientFactory clientFactory,
            UserManager<IdentityUser> userManager,
            IWebHostEnvironment env,
            IServer server,
            RoleManager<IdentityRole> _roleManager,
            DataContext _dataContext,
            SignInManager<IdentityUser> sIM,
            IEmailSender<IdentityUser> _emailSender,
            IWebHostEnvironment hostEnvironment)
        {
            _clientFactory = clientFactory;
            _userManager = userManager;
            _env = env;
            _signInManager = sIM;
            baseUrl = server.Features.Get<IServerAddressesFeature>()?.Addresses.FirstOrDefault();
            roleManager = _roleManager;
            dataContext = _dataContext;
            emailSender = _emailSender;
            _hostEnvironment = hostEnvironment;
            dataRepository = new DataRepository(_dataContext);
        }

        [HttpPost("Login"), AllowAnonymous]
        public async Task<Results<Ok<AccessTokenResponse>, EmptyHttpResult, ProblemHttpResult>>
        LoginInTest([FromBody] LoginRequest login)
        {

            // Check if the user's email is confirmed
            var user = await _userManager.FindByEmailAsync(login.Email);
            if (user != null && !await _userManager.IsEmailConfirmedAsync(user))
            {
                return TypedResults.Problem("Please confirm your email.", statusCode: StatusCodes.Status401Unauthorized);
            }

            var signInManager = _signInManager;
            var useSessionCookies = false;
            var useCookies = false;

            var useCookieScheme = (useCookies == true) || (useSessionCookies == true);
            var isPersistent = (useCookies == true) && (useSessionCookies != true);
            signInManager.AuthenticationScheme = useCookieScheme ? IdentityConstants.ApplicationScheme : IdentityConstants.BearerScheme;

            var result = await signInManager.PasswordSignInAsync(login.Email, login.Password, isPersistent, lockoutOnFailure: true);

            if (result.RequiresTwoFactor)
            {
                if (!string.IsNullOrEmpty(login.TwoFactorCode))
                {
                    result = await signInManager.TwoFactorAuthenticatorSignInAsync(login.TwoFactorCode, isPersistent, rememberClient: isPersistent);
                }
                else if (!string.IsNullOrEmpty(login.TwoFactorRecoveryCode))
                {
                    result = await signInManager.TwoFactorRecoveryCodeSignInAsync(login.TwoFactorRecoveryCode);
                }
            }

            if (!result.Succeeded)
            {
                return TypedResults.Problem(result.ToString(), statusCode: StatusCodes.Status401Unauthorized);
            }

            // The signInManager already produced the needed response in the form of a cookie or bearer token.
            return TypedResults.Empty;
        }

        [HttpPost("ForgotPassword"), AllowAnonymous]
        public async Task<Results<Ok, ValidationProblem>> ForgotPassword([FromBody] ForgotPasswordRequest resetRequest )
        {
            var userManager = _userManager;
            var user = await userManager.FindByEmailAsync(resetRequest.Email);

            if (user is not null && await userManager.IsEmailConfirmedAsync(user))
            {
                var code = await userManager.GeneratePasswordResetTokenAsync(user);
                code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

                await emailSender.SendPasswordResetCodeAsync(user, resetRequest.Email, HtmlEncoder.Default.Encode(code));
                //await emailSenderB.SendPasswordResetEmail(resetRequest.Email, "Password Reset Request", HtmlEncoder.Default.Encode(code));

            }
            // Don't reveal that the user does not exist or is not confirmed, so don't return a 200 if we would have
            // returned a 400 for an invalid code given a valid user email.
            return TypedResults.Ok();
        }

        [HttpGet("current-user-email")]
        public ActionResult<string> GetCurrentUserEmail()
        {
            var emailClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            
            var emailClaimB = GetUserEmailFromClaims();

            if (emailClaim == null)
            {
                return NotFound("Email claim not found");
            }

            var isInAdminRole = User.IsInRole("Administrator");
            var isInAdminRoleB = IsAdministrator();

            return Ok(new { Email = emailClaim.Value, EmailB = emailClaimB, IsAdministrator = isInAdminRole, IsAdministratorB = isInAdminRoleB });
        }

        [HttpGet("IsAdministrator")]
        public ActionResult<bool> IsUserAdministrator()
        {
            var isInAdminRole = User.IsInRole("Administrator");

            if(isInAdminRole)
            {
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("GetAlbumsList"), Authorize(Roles = "Administrator")]
        public ActionResult<List<AlbumManagerJsonModel>> GetAlbums()
        {
            var albums = dataContext.AlbumEntries!.ToList();
            List<AlbumManagerJsonModel> albumJsonModels = [];

            foreach(var album in albums)
            {
                Console.WriteLine($"Album Name: {album.AlbumName}, Release Date: {album.ReleaseDate}, Album Id: {album.AlbumId}, Kebab Case Name: {album.KebabCaseName}");
                var albumJsonModel = new AlbumManagerJsonModel()
                {
                    AlbumName = album.AlbumName,
                    AlbumId = album.AlbumId
                };

                albumJsonModels.Add(albumJsonModel);
            }

            return Ok(albumJsonModels);
        }

        [HttpPost("SetAlbumCover"), Authorize(Roles = "Administrator")]
        public async Task<IActionResult> SetAlbumCover([FromForm] FileUploadRequest form)
        {
        if (string.IsNullOrEmpty(form.AlbumId) || form.PictureFile == null || form.PictureFile.Length == 0 || !IsImgFile(form.PictureFile) 
            || !dataRepository.AlbumIdExists(form.AlbumId))
            {
                return BadRequest("Invalid data or file");
            }

            // Handle the file and the string data here
            // ...
            string fileName = form.AlbumId + Path.GetExtension(form.PictureFile.FileName);
            string filePath = Path.Combine(_hostEnvironment.WebRootPath, "images", fileName);
            DeleteFileIfExists(Path.Combine(_hostEnvironment.WebRootPath, "images"), form.AlbumId);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await form.PictureFile.CopyToAsync(fileStream);
            }

            return Ok("File and data received successfully");
        }

        [HttpPost("SetSong"), Authorize(Roles = "Administrator")]
        public async Task<IActionResult> SetSong([FromForm] SongUploadRequest songForm)
        {
            if (string.IsNullOrEmpty(songForm.AlbumID) || songForm.SongFile == null || songForm.SongFile.Length == 0 || !IsAudioFile(songForm.SongFile) 
                || !dataRepository.AlbumIdExists(songForm.AlbumID))
            {
                return BadRequest("Invalid data or file");
            }

            string songNewGUID = Guid.NewGuid().ToString();
            string fileName = songNewGUID + Path.GetExtension(songForm.SongFile.FileName);
            string filePath = Path.Combine(MainDirectory, $"Music/{songForm.AlbumID}/mp3/{fileName}");
            
            // Create directories in filePath if they don't exist
            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await songForm.SongFile.CopyToAsync(fileStream);
            }

            // add entries to database

            SongData songData = new()
            {
                songName = songForm.SongName,
                AlbumName = dataRepository.GetAlbumNameByAlbumID(songForm.AlbumID)!,
                AlbumId = songForm.AlbumID,
                Length = "3:23",
                FileGetCode = songNewGUID,
                AlbumPosition = songForm.AlbumPosition,
                KebabCaseName = ToKebabCase(songForm.SongName),
                songPrice = songForm.SongPrice
            };
            await dataRepository.AddNewSong(songData);
            return Ok("File and data received successfully");
        }

        [HttpPut("PutSong"), Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PutSong([FromForm] SongPutRequest songForm)
        {
            if (string.IsNullOrEmpty( songForm.SongName) || 
            string.IsNullOrEmpty(songForm.SongID) || 
            string.IsNullOrEmpty(songForm.SongLength) || 
            string.IsNullOrEmpty(songForm.AlbumPosition.ToString()) || 
            !dataRepository.SongIdExists(songForm.SongID))
            {
                return BadRequest("Invalid data or file");
            } 

            // find and alter entry in database
            await dataRepository.AlterSongEntry(songForm);

            return Ok("File and data received successfully");
        }

        [HttpDelete("DeleteSong"), Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PutSong(string songID)
        {
            if (!dataRepository.SongIdExists(songID))
            {
                return BadRequest("Invalid song id");
            }
            string albumID = await dataRepository.GetAlbumIDFromSong(songID);
            // delete entry in database
            await dataRepository.DeleteSongEntry(songID);

            // delete file in folder
            string path = Path.Combine(MainDirectory, $"Music/{albumID}/mp3/");
            if (Directory.Exists(path))
            {
                DeleteFileWithUnknownExtension(path, songID);
            }

            return Ok("File and data received successfully");
        }

        [HttpGet("AlbumsList"), Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetAlbumsList()
        {
            var albums = await dataRepository.GetAlbumsList();
            return Ok(albums);
        }

        [HttpGet("SongsByAlbumList"), Authorize(Roles = "Administrator")]
        public async Task<IActionResult> SongsByAlbumList(string albumID)
        {
            var songs = await dataRepository.GetSongsInAlbum(albumID);
            return Ok(songs);
        }

        [HttpPost("ManageAlbum"), Authorize(Roles = "Administrator")]
        public async Task<ActionResult> ManageAlbum([FromBody] AlbumPostJsonModel album)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            AlbumEntry albumEntry = new()
            {
                AlbumName = album.AlbumName,
                ReleaseDate = album.ReleaseDate,
                AlbumId = Guid.NewGuid().ToString(),
                KebabCaseName = ToKebabCase(album.AlbumName),
                albumPrice = album.AlbumPrice
            };

            dataContext.AlbumEntries!.Add(albumEntry);
            await dataContext.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("ManageAlbum"), Authorize(Roles = "Administrator")]
        public async Task<ActionResult> DeleteAlbum([FromBody] string albumId)
        {
            if (!dataRepository.AlbumIdExists(albumId))
            {
                return BadRequest("Invalid album id");
            }
            
            var albumToDelete = dataContext.AlbumEntries!.FirstOrDefault(a => a.AlbumId == albumId);
            
            if(albumToDelete is null)
            {
                return NotFound();
            }

            dataContext.AlbumEntries!.Remove(albumToDelete);
            await dataContext.SaveChangesAsync();

            //delete all songs associated with album
            await dataRepository.DeleteSongsInAlbum(albumId);

            //delete folder with albumId name and all files in it
            
            string path = Path.Combine(MainDirectory, $"Music/{albumId}");
            if (Directory.Exists(path))
            {
                Directory.Delete(path, true);
            }
            DeleteFileIfExists(Path.Combine(_hostEnvironment.WebRootPath, "images"), albumId);
            
            return Ok();
        }
        private string? GetUserEmailFromClaims()
        {
            var emailClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            return emailClaim?.Value;
        }

        private bool? IsAdministrator()
        {
            var isInAdminRole = User.IsInRole("Administrator");
            return isInAdminRole;
        }

        private static string ToKebabCase(string input)
        {
            var code = GenerateCode();
            var replaced = Regex.Replace(input + " " + code, @"[^a-zA-Z0-9\s]", " ");
            var trimmed = replaced.Trim();
            var hyphenated = Regex.Replace(trimmed, @"\s+", "-");
            var kebabCase = hyphenated.ToLower();

            return kebabCase;
        }

        private static string GenerateCode()
        {
            var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            var stringChars = new char[6];
            var random = new Random();

            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            return new String(stringChars);
        }
        private static bool IsImgFile(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLower();
            return extension == ".jpg" || extension == ".png" || extension == ".jpeg";
        }

        private void DeleteFileIfExists(string folderPath, string fileNameWithoutExtension)
        {
            string searchPattern = $"{fileNameWithoutExtension}.*";
            string fullPath = System.IO.Path.Combine(folderPath, searchPattern);

            foreach (var file in System.IO.Directory.EnumerateFiles(folderPath, searchPattern))
            {
                //Console.WriteLine($"Deleting file: {file}");
                System.IO.File.Delete(file);
            }
        }

        private static bool IsAudioFile(IFormFile file)
        {
            string extension = System.IO.Path.GetExtension(file.FileName).ToLower();
            return extension == ".mp3" || extension == ".ogg";
        }

        private void DeleteFileWithUnknownExtension(string directoryPath, string fileNameWithoutExtension)
        {
            if (Directory.Exists(directoryPath))
            {
                var files = Directory.GetFiles(directoryPath);
                foreach (var file in files)
                {
                    var fileInfo = new FileInfo(file);
                    if (fileInfo.Name.Replace(fileInfo.Extension, "") == fileNameWithoutExtension)
                    {
                        System.IO.File.Delete(file);
                    }
                }
            }
        }

    }
}
