using System.Collections.Generic;

namespace intranet.Models.Shipstation.Shipstation
{
    public class FulfillmentList
    {
        public List<Fulfillment> Fulfillments { get; set; }
        public int Total { get; set; }
        public int Page { get; set; }
        public int Pages { get; set; }
    }
}
