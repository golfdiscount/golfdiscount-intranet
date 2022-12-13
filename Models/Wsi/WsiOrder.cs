namespace intranet.Models.Wsi
{
    public class WsiOrder
    {
        public string? OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public string? ShippingMethod { get; set; }
        public List<WsiProduct> LineItems { get; set; }
        public WsiAddress? Customer { get; set; }
        public WsiAddress? Recipient { get; set; }

        public int Store { get; set; }
    }
}
