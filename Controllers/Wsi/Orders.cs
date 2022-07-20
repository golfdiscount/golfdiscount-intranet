using intranet.Models;
using intranet.Models.Wsi;
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
        private readonly HttpClient magentoClient;
        private readonly JsonSerializerOptions jsonOptions;

        public Orders(IHttpClientFactory clientFactory, JsonSerializerOptions jsonOptions)
        {
            wsiClient = clientFactory.CreateClient("Wsi");
            magentoClient = clientFactory.CreateClient("Magento");
            this.jsonOptions = jsonOptions;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string orderNumber)
        {
            HttpResponseMessage response = await wsiClient.GetAsync($"/api/orders/{orderNumber}");

            if (!response.IsSuccessStatusCode)
            {
                return new NotFoundObjectResult(null);
            }

            HttpContent content = response.Content;
            WsiOrder order = JsonSerializer.Deserialize<WsiOrder>(await content.ReadAsStringAsync(), jsonOptions);

            return new OkObjectResult(order);
        }

        [HttpPost]
        public async Task<IActionResult> Post(WsiOrder order)
        {
            foreach (WsiProduct product in order.Products)
            {
                HttpResponseMessage magentoResponse = await magentoClient.GetAsync($"/api/products/{product.Sku}");
                MagentoProduct productInfo = JsonSerializer.Deserialize<MagentoProduct>(await magentoResponse.Content.ReadAsStringAsync(), jsonOptions);
                product.Price = productInfo.Price;
                
            }

            StringContent orderInfo = new(JsonSerializer.Serialize(order, jsonOptions), System.Text.Encoding.UTF8, "application/json");
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
