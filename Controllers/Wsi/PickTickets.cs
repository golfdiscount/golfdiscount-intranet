using intranet.Models.Wsi.PickTicket;
using intranet.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace intranet.Controllers.Wsi
{
    [ApiController]
    [Route("api/wsi/[controller]")]
    public class PickTickets : ControllerBase
    {
        private readonly HttpClient wsiClient;
        private readonly JsonSerializerOptions jsonOptions;

        public PickTickets(IHttpClientFactory clientFactory, JsonSerializerOptions jsonOptions)
        {
            wsiClient = clientFactory.CreateClient("Wsi");
            this.jsonOptions = jsonOptions;
        }

        [HttpGet]
        public async Task<IActionResult> GetPickTicketByOrderNumber([FromQuery] string? orderNumber)
        {
            HttpResponseMessage response;

            if (orderNumber != null)
            {
                response = await wsiClient.GetAsync($"/api/picktickets?orderNumber={orderNumber}");
            } else
            {
                response = await wsiClient.GetAsync("/api/picktickets");
            }
             

            if (!response.IsSuccessStatusCode)
            {
                if ((int)response.StatusCode >= 500)
                {
                    return new StatusCodeResult(500);
                }

                return new NotFoundResult();
            }

            List<PickTicketModel> orders = JsonSerializer.Deserialize<List<PickTicketModel>>(await response.Content.ReadAsStringAsync(), jsonOptions);
            return new OkObjectResult(orders);
        }

        [HttpGet("{pickTicketNumber}")]
        public async Task<IActionResult> GetPickTicket(string pickTicketNumber)
        {
            HttpResponseMessage response = await wsiClient.GetAsync($"/api/picktickets/{pickTicketNumber}");

            if (!response.IsSuccessStatusCode)
            {
                if ((int)response.StatusCode >= 500)
                {
                    return new StatusCodeResult(500);
                }

                return new NotFoundResult();
            }

            HttpContent content = response.Content;
            PickTicketModel order = JsonSerializer.Deserialize<PickTicketModel>(await content.ReadAsStringAsync(), jsonOptions);

            return new OkObjectResult(order);
        }

        [HttpPost]
        public async Task<IActionResult> Post(PickTicketModel order)
        {
            StringContent orderInfo = new(JsonSerializer.Serialize(order, jsonOptions), System.Text.Encoding.UTF8, "application/json");
            orderInfo.Headers.Remove("Content-Type");
            orderInfo.Headers.Add("Content-Type", "application/json");
            HttpResponseMessage wsiResponse = await wsiClient.PostAsync("/api/orders", orderInfo);

            if (!wsiResponse.IsSuccessStatusCode)
            {
                if ((int)wsiResponse.StatusCode > 500)
                {
                    return new StatusCodeResult((int)wsiResponse.StatusCode);
                }

                return new BadRequestObjectResult(await wsiResponse.Content.ReadAsStringAsync());
            }

            return new OkObjectResult("Order submitted");
        }

        public class PickTicketPostModel
        {
            public string OrderNumber { get; set; }

            public int Store { get; set; }

            public AddressModel Customer { get; set; }

            public AddressModel Recipient { get; set; }

            public string ShippingMethod { get; set; }

            public DateTime OrderDate { get; set; }

            public List<PickTicketDetailPostModel> LineItems { get; set; }
        }

        public class PickTicketDetailPostModel
        {
            public int LineNumber { get; set; }

            public string Sku { get; set; }

            public int Units { get; set; }
        }
    }
}
