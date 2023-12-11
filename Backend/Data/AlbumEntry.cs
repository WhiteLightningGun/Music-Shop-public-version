using System.ComponentModel.DataAnnotations;
using Backend.Data;

namespace Backend.Data
{
    public class AlbumEntry
    {
        [Required]
        public int id { get; set; } // internal DB id, required by default, increments automatically

        [Required]
        public string? AlbumName { get; set; } // Name of Album, i.e. 'Unknown Feels'

        [Required]
        public DateTime ReleaseDate { get; set; }

        [Required]
        public string? AlbumId { get; set; } // Unique ID of album

        [Required]
        public string? KebabCaseName { get; set; }

        public decimal albumPrice { get; set; } // Price of album, in GBP

    }
}
