namespace Backend.Data;

public class OrderConfirmationEmailModel
{
    public required string Name {get; set;}
    public required string OrderID {get; set;}
    public required List<string> MusicList {get; set;}
}