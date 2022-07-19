namespace intranet.Models
{
    public class Order
    {
        public string OrderNumber { get; set; }
        public string OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public string Email { get; set; }
        public Address CustomerAddress { get; set; }
        public List<Product> Products { get; set; }
        
        public class Address
        {
            public string Name { get; set; }
            public string Street { get; set; }
            public string City { get; set; }
            public string State { get; set; }
            public string Country { get; set; }
            public string Zip { get; set; }
            public string Phone { get; set; }
        }

        public class Product
        {
            public string Sku { get; set; }
            public string ProductName { get; set; }
            public string ImageUrl { get; set; }
            public int Quantity { get; set; }
            public string Upc { get; set; }
            public int Verified { get; set; }
        }
    }
}
