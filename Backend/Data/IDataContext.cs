using Backend.Data;
using Microsoft.EntityFrameworkCore;

public interface IDataContext
{
    DbSet<AlbumEntry>? AlbumEntries { get; set; }
    DbSet<SongData>? songData { get; set; }
    DbSet<UserSongPurchases>? UserSongPurchases { get; set; }
    DbSet<UserAlbumPurchases>? UserAlbumPurchases { get; set; }
    DbSet<PaypalOrder>? PaypalOrders { get; set; }
    int SaveChanges();
}

public class DataContextWrapper : IDataContext
{
    private readonly DataContext _context;

    public DataContextWrapper(DataContext context)
    {
        _context = context;
    }

    public DbSet<AlbumEntry>? AlbumEntries { get => _context.AlbumEntries; set => _context.AlbumEntries = value; }
    public DbSet<SongData>? songData { get => _context.songData; set => _context.songData = value; }
    public DbSet<UserSongPurchases>? UserSongPurchases { get => _context.UserSongPurchases; set => _context.UserSongPurchases = value; }
    public DbSet<UserAlbumPurchases>? UserAlbumPurchases { get => _context.UserAlbumPurchases; set => _context.UserAlbumPurchases = value; }
    public DbSet<PaypalOrder>? PaypalOrders { get => _context.PaypalOrders; set => _context.PaypalOrders = value; }

    public int SaveChanges()
    {
        return _context.SaveChanges();
    }
}