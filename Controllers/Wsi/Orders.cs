using intranet.Models.Wsi.PickTicket;
using intranet.Models.Magento;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace intranet.Controllers.Wsi
{
    [ApiController]
    [Route("api/wsi/[controller]/{orderNumber?}")]
    public class Orders : ControllerBase
    {
        private readonly HttpClient wsiClient;
        private readonly JsonSerializerOptions jsonOptions;

        public Orders(IHttpClientFactory clientFactory, JsonSerializerOptions jsonOptions)
        {
            wsiClient = clientFactory.CreateClient("Wsi");
            this.jsonOptions = jsonOptions;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string? orderNumber)
        {
            Console.WriteLine(orderNumber);
            HttpResponseMessage response = await wsiClient.GetAsync($"/api/orders/{orderNumber}");

            if (!response.IsSuccessStatusCode)
            {
                if ((int)response.StatusCode >= 500)
                {
                    return new StatusCodeResult(500);
                }

                return new NotFoundResult();
            }

            HttpContent content = response.Content;
            List<PickTicketModel> orders = JsonSerializer.Deserialize<List<PickTicketModel>>(await content.ReadAsStringAsync(), jsonOptions);

            return new OkObjectResult(orders);
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
    }
}
