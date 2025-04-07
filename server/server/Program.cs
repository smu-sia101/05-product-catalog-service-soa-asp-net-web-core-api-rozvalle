using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add Swagger/OpenAPI configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	options.SwaggerDoc("v1", new OpenApiInfo
	{
		Title = "My API",
		Version = "v1",
		Description = "A simple API to interact with Firebase",
	});
});

// Allow React to access the ASP.Net Web API
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowReactApp",
		policy =>
		{
			policy.WithOrigins("http://localhost:5173") // React app URL
				  .AllowAnyMethod()
				  .AllowAnyOrigin()
				  .AllowAnyHeader();
		});
});

/* Safer storage of API key
string keyFilePath = "firebase-key.json";


if (File.Exists(keyFilePath))
{
	var credential = GoogleCredential.FromFile(keyFilePath);
	FirebaseApp.Create(new AppOptions
	{
		Credential = credential
	});
	Console.WriteLine("Firebase initialized successfully.");
} else {
	Console.WriteLine("firebase-key.json not found. Make sure it's in the root folder.");
	throw new FileNotFoundException("firebase-key.json is missing.");
}
*/

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI(c =>
	{
		c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
	});
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
