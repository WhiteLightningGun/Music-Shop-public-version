namespace Backend.Data
{
    public class SongPutRequest
    {
        public required string SongName { get; set; }
        public required string SongID {get; set;}
        public required string SongLength {get; set;}
        public required int AlbumPosition { get; set; }
        public required decimal SongPrice { get; set; }
    }
}