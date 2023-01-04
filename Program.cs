using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSpaStaticFiles();
builder.Services.AddSingleton(new JsonSerializerOptions()
{
    PropertyNameCaseInsensitive = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
});

DefaultAzureCredential cred = new();
Uri keyvaultUri = new(Environment.GetEnvironmentVariable("vault-uri"));
SecretClient secretClient = new(keyvaultUri, cred);

builder.Services.AddHttpClient("Magento", client =>
{
    KeyVaultSecret magentoUri = secretClient.GetSecret("magento-uri");
    KeyVaultSecret magentoKey = secretClient.GetSecret("magento-key");

    client.BaseAddress = new(magentoUri.Value);
    client.DefaultRequestHeaders.Add("x-functions-key", magentoKey.Value);
});
builder.Services.AddHttpClient("Wsi", client =>
{
    KeyVaultSecret wsiUri = secretClient.GetSecret("wsi-uri");
    client.BaseAddress = new(wsiUri.Value);

    KeyVaultSecret wsiKey = secretClient.GetSecret("wsi-key");
    client.DefaultRequestHeaders.Add("x-functions-key", wsiKey.Value);
});
builder.Services.AddHttpClient("Shipstation", client =>
{
    KeyVaultSecret shipstationUri = secretClient.GetSecret("shipstation-uri");
    KeyVaultSecret shipstationKey = secretClient.GetSecret("shipstation-key");
    KeyVaultSecret shipstationSecret = secretClient.GetSecret("shipstation-secret");

    client.BaseAddress = new(shipstationUri.Value);

    string shipstationCreds = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{shipstationKey.Value}:{shipstationSecret.Value}"));
    client.DefaultRequestHeaders.Authorization = new("Basic", shipstationCreds);
});

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
} 
else
{
    app.UseHsts();
}


app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{id?}"
);

app.MapFallbackToFile("index.html");

app.Run();