using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public interface IDataContext
{
    public DbSet<AlbumEntry>? AlbumEntries { get; set; }
    public DbSet<SongData>? songData { get; set; }
    public DbSet<UserSongPurchases>? UserSongPurchases { get; set; }
    public DbSet<UserAlbumPurchases>? UserAlbumPurchases { get; set; }
    public DbSet<PaypalOrder>? PaypalOrders { get; set; }
    public DbSet<IdentityUser>? Users { get; set; }
    public DbSet<IdentityRole>? Roles { get; set; }
}