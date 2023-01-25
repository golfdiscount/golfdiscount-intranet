using System.Collections.Generic;

namespace intranet.Models.Wsi.PickTicket
{
    public class PickTicketCollectionModel
    {
        public List<PickTicketModel> PickTickets { get; set; }

        public int Page { get; set; }

        public int PageSize { get; set; }
    }
}
