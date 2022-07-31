using intranet.Models;
using intranet.Models.Magento;
using intranet.Models.Shipstation;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace intranet.Controllers.ShipStation
{
    [ApiController]
    [Route("api/shipstation/[controller]/{orderNumber?}")]
    public class Orders : Controller
    {
        private readonly HttpClient ssClient;
        private readonly HttpClient magentoClient;
        private readonly JsonSerializerOptions jsonOptions;

        public Orders(IHttpClientFactory clientFactory, JsonSerializerOptions jsonOptions)
        {
            ssClient = clientFactory.CreateClient("Shipstation");
            magentoClient = clientFactory.CreateClient("Magento");
            this.jsonOptions = jsonOptions;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string orderNumber)
        {
            HttpResponseMessage response = await ssClient.GetAsync($"/orders?orderNumber={orderNumber}");

            if (!response.IsSuccessStatusCode)
            {
                if ((int)response.StatusCode > 500)
                {
                    return new StatusCodeResult((int)response.StatusCode);
                }

                return new BadRequestObjectResult(await response.Content.ReadAsStringAsync());
            }

            HttpContent content = response.Content;
            OrderList orders = JsonSerializer.Deserialize<OrderList>(await content.ReadAsStringAsync(), jsonOptions);

            SsOrder ssOrder = null;

            orders.Orders.ForEach(ssApiOrder =>
            {
                if (ssApiOrder.OrderNumber == orderNumber)
                {
                    ssOrder = ssApiOrder;   
                }
            });

            if (ssOrder == null)
            {
                return new NotFoundObjectResult($"Could not find order {orderNumber}");
            }

            Order order = new()
            {
                OrderNumber = ssOrder.OrderNumber,
                OrderDate = ssOrder.OrderDate,
                OrderStatus = ssOrder.OrderStatus,
                Email = ssOrder.CustomerEmail,
                CustomerAddress = new()
                {
                    Name = ssOrder.ShipTo.Name,
                    Street = $"{ssOrder.ShipTo.Street1} {ssOrder.ShipTo.Street2}",
                    City = ssOrder.ShipTo.City,
                    State = ssOrder.ShipTo.State,
                    Zip = ssOrder.ShipTo.PostalCode,
                    Country = ssOrder.ShipTo.Country,
                    Phone = ssOrder.ShipTo.Phone
                },
                Products = new()
            };

            foreach(Item item in ssOrder.Items)
            {
                response = await magentoClient.GetAsync($"/api/products/{item.Sku}");

                if (response.IsSuccessStatusCode)
                {
                    MagentoProduct product = JsonSerializer.Deserialize<MagentoProduct>(await response.Content.ReadAsStringAsync(), jsonOptions);
                    order.Products.Add(new()
                    {
                        Sku = product.Sku,
                        ProductName = product.Name,
                        ImageUrl = item.ImageUrl,
                        Quantity = (int)item.Quantity,
                        Upc = product.Upc,
                        Verified = 0
                    });
                } else
                {
                    return new StatusCodeResult(500);
                }
            }

            return new OkObjectResult(order);
        }
    }
}
