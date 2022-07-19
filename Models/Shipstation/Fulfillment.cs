namespace intranet.Models.Shipstation.Shipstation
{
    public class Fulfillment
    {
        public int FulfillmentId { get; set; }
        public int OrderId { get; set; }
        public string OrderNumber { get; set; }
        public string UserId { get; set; }
        public string CustomerEmail { get; set; }
        public string TrackingNumber { get; set; }
        public string CreateDate { get; set; }
        public string ShipDate { get; set; }
        public string VoidDate { get; set; }
        public string DeliveryDate { get; set; }
        public string CarrierCode { get; set; }
        public string FulfillmentProviderCode { get; set; }
        public string FulfillmentServiceCode { get; set; }
        public decimal FulfillmentFee { get; set; }
        public bool VoidRequested { get; set; }
        public bool Voided { get; set; }
        public bool MarketplaceNotified { get; set; }
        public string NotifyErrorMessage { get; set; }
        public Address ShipTo { get; set; }

    }
}
