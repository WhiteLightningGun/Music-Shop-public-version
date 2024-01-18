namespace Backend.Data
{
    public class UserSongPurchases
    {
        public int Id { get; set; } // Unique ID of record in DB, self incrementing
        public required string UserID { get; set; } // Unique ID of user
        public required string UserEmail { get; set; }
        public required string SongID { get; set; } 
        public required string SongName { get; set; }  
        public required decimal PricePaid { get; set; } 
        public required string Currency { get; set; } 
        public required DateTime TimeOfPurchase { get; set; } 
        public UserSongPurchases(string userID, string songID, decimal pricePaid)
        {
            UserID = userID;
            SongID = songID;
            PricePaid = pricePaid;
        }
    }
}
