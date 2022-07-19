namespace intranet.Models.Wsi
{
    public class WsiOrder
    {
        public string? OrderNumber { get; set; }
        public string? OrderDate { get; set; }
        public string? ShippingMethod { get; set; }
        public List<WsiProduct> Products { get; set; }
        public WsiAddress? Customer { get; set; }
        public WsiAddress? Recipient { get; set; }
    }
}
