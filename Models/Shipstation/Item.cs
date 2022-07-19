namespace intranet.Models.Shipstation
{
    public class Item
    {
        public int OrderItemId { get; set; }
        public string LineItemKey { get; set; }
        public string Sku { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public Weight Weight { get; set; }
        public double Quantity { get; set; }
        public double UnitPrice { get; set; }
        public double? TaxAmount { get; set; }
        public double? ShippingAmount { get; set; }
        public string WarehouseLocation { get; set; }
        public int? ProductId { get; set; }
        public string FulfillmentSku { get; set; }
        public bool? Adjustment { get; set; }
        public string Upc { get; set; }
        public string CreateDate { get; set; }
        public string ModifyDate { get; set; }
    }
}
