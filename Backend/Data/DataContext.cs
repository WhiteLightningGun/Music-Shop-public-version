using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class DataContext : IdentityDbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        public DbSet<AlbumEntry>? AlbumEntries { get; set; }
        public DbSet<SongData>? songData { get; set; }
        public DbSet<UserSongPurchases>? UserSongPurchases { get; set; }
        public DbSet<UserAlbumPurchases>? UserAlbumPurchases { get; set; }
    }
}
