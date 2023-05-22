using intranet.Models;
using intranet.Models.Magento;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace intranet.Controllers.Magento
{
    [Route("api/magento/[controller]/{orderNumber}")]
    [ApiController]
    public class Orders : ControllerBase
    {
        private readonly HttpClient _magentoClient;
        private readonly JsonSerializerOptions _jsonOptions;

        public Orders(IHttpClientFactory clientFactory, JsonSerializerOptions jsonOptions)
        {
            _magentoClient = clientFactory.CreateClient("Magento");
            _jsonOptions = jsonOptions;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string orderNumber)
        {
            HttpResponseMessage response = await _magentoClient.GetAsync($"/api/orders/{orderNumber}");
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

                // TODO: Magento API currently does not return error message for 404 errors
                //errorMessage.Message = await content.ReadAsStringAsync();
                errorMessage.Message = $"Order {orderNumber} not found in Magento";
                return new NotFoundObjectResult(errorMessage);
            }

            MagentoOrderModel order = JsonSerializer.Deserialize<MagentoOrderModel>(await content.ReadAsStringAsync(), _jsonOptions);

            return new OkObjectResult(order);
        }
    }
}
