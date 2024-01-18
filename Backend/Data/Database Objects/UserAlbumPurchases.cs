namespace Backend.Data
{
    public class UserAlbumPurchases
    {
        public int Id { get; set; } 
        public required string UserID { get; set; } 
        public required string UserEmail { get; set; } 
        public required string AlbumID { get; set; } 
        public required string SongName { get; set; }   
        public required decimal PricePaid { get; set; } 
        public required string Currency { get; set; } 
        public required DateTime TimeOfPurchase { get; set; } 
        public UserAlbumPurchases(string userID, string albumID, decimal pricePaid)
        {
            UserID = userID;
            AlbumID = albumID;
            PricePaid = pricePaid;
        }
    }
}
