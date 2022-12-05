namespace intranet.Models.Wsi
{
    public class PickTicket
    {
        public string PickTicketNumber { get; set; }
        
        public string OrderNumber { get; set; }

        public string Action { get; set; }

        public int Store { get; set; }

        public Address Customer { get; set; }

        public Address Recipient { get; set; }

        public string ShippingMethod { get; set; }

        public List<LineItem> LineItems { get; set; }

        public DateTime OrderDate { get; set; }

        public int Channel { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public class Address
        {
            public string Name { get; set; }

            public string Street { get; set; }

            public string City { get; set; }

            public string State { get; set; }

            public string Country { get; set; }

            public string Zip { get; set; }
        }

        public class LineItem
        {
            public string PickTicketNumber { get; set; }

            public int LineNumber { get; set; }

            public string Action { get; set; }

            public string Sku { get; set; }

            public int Units { get; set; }

            public int UnitsToShip { get; set; }

            public DateTime CreatedAt { get; set; }

            public DateTime UpdatedAt { get; set; }
        }
    }
}
