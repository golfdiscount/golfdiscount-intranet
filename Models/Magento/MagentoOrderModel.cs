namespace intranet.Models.Magento
{
    public class MagentoOrderModel
    {
        public int Id { get; set; }

        public string OrderNumber { get; set; }

        public string State { get; set; }

        public string Status { get; set; }

        public string Shipping { get; set; }

        public AddressModel Customer { get; set; }

        public AddressModel Recipient { get; set; }

        public string PaymentMethod { get; set; }

        public float OrderTotal { get; set; }

        public float ShippingTotal { get; set; }

        public List<MagentoProduct> Products { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
