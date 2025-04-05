using Microsoft.AspNetCore.Mvc;
using server.Models;
using Google.Cloud.Firestore;

namespace server.Controllers
{
	[ApiController]
	[Route("api/products")]
	public class ProductsController : ControllerBase
	{
		private readonly FirestoreDb _firestore;

		public ProductsController()
		{
			_firestore = FirestoreDb.Create("sia-aspapi");
		}

		[HttpGet]
		public async Task<ActionResult<List<Product>>> GetAllProducts()
		{
			Query query = _firestore.Collection("products");
			QuerySnapshot snapshot = await query.GetSnapshotAsync();
			List<Product> products = snapshot.Documents.Select(doc => doc.ConvertTo<Product>()).ToList();
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
			CollectionReference colRef = _firestore.Collection("products");
			DocumentReference docRef = await colRef.AddAsync(product);

			product.Id = docRef.Id;

			await docRef.UpdateAsync("Id", product.Id);

			return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
		}

		[HttpPut("{id}")]
		public async Task<ActionResult> UpdateProduct(string id, [FromBody] Product product)
		{
			DocumentReference docRef = _firestore.Collection("products").Document(id);
			DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

			if (!snapshot.Exists)
				return NotFound();

			product.Id = id;

			await docRef.SetAsync(product);
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
