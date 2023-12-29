namespace Backend.Data;

public class PaypalOrder
{
    public int Id {get; set;}
    public string? OrderId {get; set;}
    public bool OrderCompleted {get; set;}
    public string? UserId {get; set;}
    public List<string?> ProductIds {get; set;}
}