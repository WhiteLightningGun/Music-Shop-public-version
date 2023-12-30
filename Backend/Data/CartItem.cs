namespace Backend.Data;

public class CartItem
{   
    /// <summary>
    /// The id of the cart item, this is the name of the song or album
    /// </summary>
    public string? Id { get; set; }
    /// <summary>
    /// The value of the cart item, i.e. price of song or album
    /// </summary>
    public string? value { get; set; }
    /// <summary>
    /// The product id of the cart item, this is the GUID used for database purposes
    /// </summary>
    public string? productID { get; set; }
}