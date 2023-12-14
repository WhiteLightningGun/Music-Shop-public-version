namespace Backend.Data
{
    public class UserSongPurchases
    {
        public int Id { get; set; } // Unique ID of record in DB, self incrementing
        public required string UserID { get; set; } // Unique ID of user
        public required string UserEmail { get; set; } // Email of user
        public required string SongID { get; set; } // Unique ID of song
        public required string SongName { get; set; } // Name of song   
        public required decimal PricePaid { get; set; } // Price paid for song
        public required string Currency { get; set; } // Currency of price paid
        public required DateTime TimeOfPurchase { get; set; } // Time of purchase
        public UserSongPurchases(string userID, string songID, decimal pricePaid)
        {
            UserID = userID;
            SongID = songID;
            PricePaid = pricePaid;
        }
    }
}
