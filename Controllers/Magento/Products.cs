using intranet.Models;
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
            HttpContent content = response.Content;

            if (!response.IsSuccessStatusCode)
            {
                ErrorMessageModel errorMessage = new();
                if ((int)response.StatusCode >= 500)
                {
                    errorMessage.Message = "There was an internal server error";
                    ObjectResult result = new(errorMessage)
                    {
                        StatusCode = 500
                    };
                    return result;

                }

                errorMessage.Message = await content.ReadAsStringAsync();
                return new NotFoundObjectResult(errorMessage);
            }

            MagentoProduct product = JsonSerializer.Deserialize<MagentoProduct>(await content.ReadAsStringAsync(), jsonOptions);

            return new OkObjectResult(product);
        }
    }
}
