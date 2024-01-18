using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Backend.Data
{
    public class SongJsonModel
    {
        public string? songName;

        public string? AlbumName;

        public string? Length;

        public string? FilePathName;

        public int AlbumPosition;
        public decimal SongPrice;
        public string? albumID;
    }

    public class AlbumJsonModel
    {
        public string? AlbumName;

        public DateTime ReleaseDate;

        public string? FrontCoverPath;

        public List<SongJsonModel>? TrackList;

        public string? TrackCount;

        public string? kebabCase;
        public decimal AlbumPrice;
        public string? AlbumID;
    }

        public class AlbumManagerJsonModel
        {
            public string? AlbumName {get; set;}
            public string? AlbumId {get; set;}
        }
    public sealed class AlbumPostJsonModel
    {
        public AlbumPostJsonModel(){
            AlbumPrice = 5.00m;
        }

        [StringLength(100, MinimumLength = 2)]
        public required string AlbumName {get; set;}

        public required DateTime ReleaseDate {get; set;}
        public decimal AlbumPrice {get; set;}
    }
}
