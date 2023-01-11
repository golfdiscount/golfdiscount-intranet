using intranet.Models.Magento;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace intranet.Controllers.Magento
{
    [Route("api/magento/[controller]/{orderNumber}")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly HttpClient _magentoClient;
        private readonly JsonSerializerOptions _jsonOptions;

        public OrdersController(IHttpClientFactory clientFactory, JsonSerializerOptions jsonOptions)
        {
            _magentoClient = clientFactory.CreateClient("Magento");
            _jsonOptions = jsonOptions;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string orderNumber)
        {
            HttpResponseMessage response = await _magentoClient.GetAsync($"/api/orders/{orderNumber}");

            if (!response.IsSuccessStatusCode)
            {
                if ((int)response.StatusCode >= 500)
                {
                    return new StatusCodeResult(500);
                }

                return new NotFoundResult();
            }

            HttpContent content = response.Content;
            MagentoOrderModel order = JsonSerializer.Deserialize<MagentoOrderModel>(await content.ReadAsStringAsync(), _jsonOptions);

            return new OkObjectResult(order);
        }
    }
}
