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

// Allow React to access the server
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

// Initialize Firebase Admin SDK
builder.Services.AddSingleton(FirebaseApp.Create(new AppOptions()
{
	Credential = GoogleCredential.FromFile("firebase-key.json") // Path to your Firebase key file
}));

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
