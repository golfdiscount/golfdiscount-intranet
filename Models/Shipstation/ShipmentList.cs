using System.Collections.Generic;

namespace intranet.Models.Shipstation
{
    public class ShipmentList
    {
        public List<Shipment> Shipments { get; set; }
        public int Total { get; set; }
        public int Page { get; set; }
        public int Pages { get; set; }
    }
}
