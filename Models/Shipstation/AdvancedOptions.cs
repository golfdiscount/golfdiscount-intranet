namespace intranet.Models.Shipstation
{
    public class AdvancedOptions
    {
        public int WarehouseId { get; set; }
        public bool NonMachinable { get; set; }
        public bool SaturdayDelivery { get; set; }
        public bool ContainsAlcohol { get; set; }
        public int StoreId { get; set; }
        public string? CustomField1 { get; set; }
        public string? CustomField2 { get; set; }
        public string? CustomField3 { get; set; }
        public string? Source { get; set; }
        public bool MergedOrSplit { get; set; }
        public int[]? MergedIds { get; set; }
        public int? ParentId { get; set; }
        public string? BillToParty { get; set; }
        public string? BillToAccount { get; set; }
        public string? BillToPostalCode { get; set; }
        public string? BillToCountryCode { get; set; }
        public int? BillToMyOtherAccount { get; set; }
    }
}
