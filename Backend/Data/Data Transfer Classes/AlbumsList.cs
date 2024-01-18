using System.ComponentModel.DataAnnotations;
using Backend.Data;

namespace Backend.Data
{
    public class AlbumsListEntry
    {
        public string? AlbumName { get; set; } // Name of Album, i.e. 'Unknown Feels'

        public string? AlbumId { get; set; } // Unique ID of album
    }
}
