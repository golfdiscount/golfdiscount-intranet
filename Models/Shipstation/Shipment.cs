using System.Collections.Generic;

namespace intranet.Models.Shipstation
{
    public class Shipment
    {
        public int ShipmentId { get; set; }
        public int OrderId { get; set; }
        public string OrderKey { get; set; }
        public string UserId { get; set; }
        public string CustomerEmail { get; set; }
        public string OrderNumber { get; set; }
        public string CreateDate { get; set; }
        public string ShipDate { get; set; }
        public double ShipmentCost { get; set; }
        public double InsuranceCost { get; set; }
        public string TrackingNumber { get; set; }
        public bool IsReturnLabel { get; set; }
        public string BatchNumber { get; set; }
        public string CarrierCode { get; set; }
        public string ServiceCode { get; set; }
        public string PackageCode { get; set; }
        public string Confirmation { get; set; }
        public int WarehouseId { get; set; }
        public bool Voided { get; set; }
        public string VoidDate { get; set; }
        public bool MarketplaceNotified { get; set; }
        public string NotifyErrorMessage { get; set; }

        public Address ShipTo { get; set; }
        public Weight Weight { get; set; }

        public Dimensions Dimensions { get; set; }

        public InsuranceOptions InsuranceOptions { get; set; }
        public List<Item> ShipmentItems { get; set; }

        public AdvancedOptions AdvancedOptions { get; set; }
    }
}
