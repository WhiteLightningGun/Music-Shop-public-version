namespace Backend.Data
{
    public class SongUploadRequest
    {
        public required string SongName { get; set; }
        public required IFormFile SongFile { get; set; }
        public required string AlbumID { get; set; }
        public required int AlbumPosition { get; set; }
    }
}