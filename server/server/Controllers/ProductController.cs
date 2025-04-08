﻿using Microsoft.AspNetCore.Mvc;
using server.Models;
using Google.Cloud.Firestore;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using System.Text;
using Google.Cloud.Firestore.V1;

namespace server.Controllers
{
	[ApiController]
	[Route("api/products")]
	public class ProductsController : ControllerBase
	{
		private readonly FirestoreDb _firestore;

		public ProductsController()
		{
			string keyFilePath = Path.Combine(AppContext.BaseDirectory, "firebase-key.json");

			if (!System.IO.File.Exists(keyFilePath))
			{
				throw new FileNotFoundException("firebase-key.json not found.", keyFilePath);
			}

			var credential = GoogleCredential.FromFile(keyFilePath);

			// Set up Firestore client with credentials
			var builder = new FirestoreClientBuilder
			{
				Credential = credential
			};

			FirestoreClient client = builder.Build();
			_firestore = FirestoreDb.Create("sia-aspapi", client);
		}

		[HttpGet]
		public async Task<ActionResult<List<Product>>> GetAllProducts()
		{
			Query query = _firestore.Collection("products").OrderByDescending("CreatedAt");
			QuerySnapshot snapshot = await query.GetSnapshotAsync();
			List<Product> products = snapshot.Documents.Select(doc => doc.ConvertTo<Product>()).ToList();
			Console.WriteLine($"Fetched {products.Count} products.");
			return Ok(products);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Product>> GetProductById(string id)
		{
			DocumentReference docRef = _firestore.Collection("products").Document(id);
			DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

			if (!snapshot.Exists)
				return NotFound();
			return Ok(snapshot.ConvertTo<Product>());
		}

		[HttpPost]
		public async Task<ActionResult> CreateProduct([FromBody] Product product)
		{
			product.CreatedAt = FieldValue.ServerTimestamp;
			CollectionReference colRef = _firestore.Collection("products");
			

			DocumentReference docRef = await colRef.AddAsync(product);

			return CreatedAtAction(nameof(GetProductById), new { id = docRef.Id }, product);
		}

		[HttpPut("{id}")]
		public async Task<ActionResult> UpdateProduct(string id, [FromBody] Product product)
		{
			DocumentReference docRef = _firestore.Collection("products").Document(id);
			DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

			if (!snapshot.Exists)
				return NotFound();

			product.Id = id;

			var updates = new Dictionary<string, object>
			{
				{ "Name", product.Name },
				{ "Price", product.Price },
				{ "Description", product.Description },
				{ "Category", product.Category },
				{ "Stock", product.Stock },
				{ "ImageUrl", product.ImageUrl },
			};
				await docRef.UpdateAsync(updates);
				return NoContent();
			}

		[HttpDelete("{id}")]
		public async Task<ActionResult> DeleteProduct(string id)
		{
			DocumentReference docRef = _firestore.Collection("products").Document(id);
			DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

			if (!snapshot.Exists)
				return NotFound();

			await docRef.DeleteAsync();
			return NoContent();
		}
	}
}
