namespace Backend.Data
{
    public class UserAlbumPurchases
    {
        public int Id { get; set; } // Unique ID of record in DB, self incrementing
        public required string UserID { get; set; } // Unique ID of user
        public required string UserEmail { get; set; } // Email of user
        public required string AlbumID { get; set; } // Unique ID of song
        public required string SongName { get; set; } // Name of song   
        public required decimal PricePaid { get; set; } // Price paid for song
        public required string Currency { get; set; } // Currency of price paid
        public required DateTime TimeOfPurchase { get; set; } // Time of purchase
        public UserAlbumPurchases(string userID, string albumID, decimal pricePaid)
        {
            UserID = userID;
            AlbumID = albumID;
            PricePaid = pricePaid;
        }
    }
}
