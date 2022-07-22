using System.Collections.Generic;

namespace intranet.Models.Shipstation
{
    public class SsOrder
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; }
        public string OrderKey { get; set; }
        public string OrderDate { get; set; }
        public string CreateDate { get; set; }
        public string ModifyDate { get; set; }
        public string PaymentDate { get; set; }
        public string ShipByDate { get; set; }
        public string OrderStatus { get; set; }
        public int CustomerId { get; set; }
        public string CustomerUsername { get; set; }
        public string CustomerEmail { get; set; }
        public Address BillTo { get; set; }
        public Address ShipTo { get; set; }
        public List<Item> Items { get; set; }
        public decimal OrderTotal { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal ShippingAmount { get; set; }
        public string CustomerNotes { get; set; }
        public string InternalNotes { get; set; }
        public bool Gift { get; set; }
        public string GiftMessage { get; set; }
        public string PaymentMethod { get; set; }
        public string RequestedShippingService { get; set; }
        public string CarrierCode { get; set; }
        public string ServiceCode { get; set; }
        public string PackageCode { get; set; }
        public string Confirmation { get; set; }
        public string ShipDate { get; set; }
        public string HoldUntilDate { get; set; }
        public Weight Weight { get; set; }
        public Dimensions Dimensions { get; set; }
        public InsuranceOptions InsuranceOptions { get; set; }
        public List<int> TagIds { get; set; }
        public string UserId { get; set; }
        public bool ExternallyFulfilled { get; set; }
        public string ExternallyFulFilledBy { get; set; }
        public AdvancedOptions AdvancedOptions { get; set; }
    }
}
