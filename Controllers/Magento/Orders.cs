using intranet.Models.Magento;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace intranet.Controllers.Magento
{
    [ApiController]
    [Route("api/magento/[controller]/{productSku}")]
    public class Products : ControllerBase
    {
        private readonly HttpClient magentoClient;
        private readonly JsonSerializerOptions jsonOptions;

        public Products(IHttpClientFactory clientFactory, JsonSerializerOptions jsonOptions)
        {
            magentoClient = clientFactory.CreateClient("Magento");
            this.jsonOptions = jsonOptions;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string productSku)
        {
            HttpResponseMessage response = await magentoClient.GetAsync($"/api/products/{productSku}");

            if (!response.IsSuccessStatusCode)
            {
                if ((int)response.StatusCode >= 500)
                {
                    return new StatusCodeResult(500);
                }

                return new NotFoundResult();
            }

            HttpContent content = response.Content;
            MagentoProduct product = JsonSerializer.Deserialize<MagentoProduct>(await content.ReadAsStringAsync(), jsonOptions);

            return new OkObjectResult(product);
        }
    }
}
