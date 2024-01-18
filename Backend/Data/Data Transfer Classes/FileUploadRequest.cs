namespace Backend.Data
{

    public class FileUploadRequest
    {
        public required string AlbumId { get; set; }
        public required IFormFile PictureFile { get; set; }
    }
}
