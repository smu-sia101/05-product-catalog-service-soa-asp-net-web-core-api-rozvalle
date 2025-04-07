using Microsoft.AspNetCore.Mvc;
using server.Models;
using Google.Cloud.Firestore;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using System.Text;

namespace server.Controllers
{
	[ApiController]
	[Route("api/products")]
	public class ProductsController : ControllerBase
	{
		private readonly FirestoreDb _firestore;

		public ProductsController()
		{
			// API Key
			string firebaseKey = @"{
			  ""type"": ""service_account"",
			  ""project_id"": ""sia-aspapi"",
			  ""private_key_id"": ""6a5a5d097b997006e56f4a482c5c6578928461cb"",
			  ""private_key"": ""-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDmAPD0zB/+hswB\n5CXNUmgnjJF3vKUlPR9vA0qkaJjd5DTg+PsdNE0bmIO68EbsOgyfSB75W1ejQGsx\nqAYzJ5x79UpFScdGvoQcCsFOC9y1O9Nvbb41Y/EKK3nDJlNmqfry14oZhKNA52/G\nND18uzMVPiFLRwV4bNHWZFhRDuRnDDAxOACKxdtArMTIcPzqQe8/imNIjMTrILVK\ngdZOetKHBwygiuXvGDIMklP6GD0xBWUvhgHN9yPNqWHH2XL2cXz/zmXCHtN76OP+\nxthQzt4+kBqsldwuEQp521+DipXiL8OMsE2hlErIHx8pcMjYz9V7XC5ZF/6a4iDI\n4Oaz2fNzAgMBAAECggEAE7aG8GRCZb1F5O+Z8dQbSzB4E0we12c6t3gPwLGaUIJL\nqfCNDT67UR8sQyxu17ZN+KTkyrhydXKC/XmKNn4xokouuGuPYdfYWNLvKHJJ01qy\nT32XbNoJAbciM4Coa0csU/33PyKoH1r2sIUvs+4TfcGaduo6ZMzm2zo0e5YMK2yt\nY0sNqkD0Ay5UuQQKMtmq2mG8YpBaJQDCHV1T3TKHJRY1Jjv7aJJ+sNmdCVzNC9pY\nNg7yAAQW988BDogaUteEGw8fH9zDl59dQMVsWct/1KiHsmdnIyQrQZ9qYigGWKZv\ngK6j7MqEWTup5v8oaM+9VgPgRnCeWaWci/e9uZkHQQKBgQD6R4GuWf/eWwasvjk4\nXHacgugHdAi41fwI8z1rrWGOqQ+k9H7DC4dmA338q24jqx7D3Tomov9HBBGtD5Uh\nuGOlMycsCFuSfBTivllYjdn9tOYtv5pGtIC/ZjMc6fAFyfdZza+qtbcD6cWAvJok\n55zA8WMEzYVUTWIhHPI5aAfAoQKBgQDrQssDsdyggi+806Dyf9qmdSTxwuPQxanL\njgeEQ73HU1qc7iBjZjDNV2keEKScqSiqsRZNPwR82tJSnbBWwnWfKvwrsGEQCH1T\nPJGLSEXh8YPOzZOOERbzt5vc/DYi3Sn1Yqi9BEXeAn3BH7iiB4Zi5Sk7Ti/dvvCy\n/IsEMav3kwKBgQCIxSbjBp/C/W9qWxGd8TmIUilGWWyixZ1Trskz3K3hbhX0iP/0\nyooVf3cL6wrnRw4q7uxmTNDAGEMolcljggZCMvAHKhIQvOoU9vyQXgRwlrjq6zf9\nx4pMDieEd3sJTtNzKeoDmgYHh2q87VQ3MrMA5Wi9KSrhZOBpRA5CvMzvwQKBgHmB\nbcjiu8hKdM1Zn+6fChaeug4DUhYpgKCZIli1g/bGni4e7qtnxBzJ4Iien+Ypl89Q\n1uveeDrj6Wyx9LlahdVHJiaKWhcly1SKG8GL+kvPqPvOQT9GpEwLsHxZ5rvq7hjG\nc8/rvQoEz15HO9yzdjztjnYK0737N+W5eTMZVG/xAoGBAIcOyNPJyD8YFsBN9+c8\n6z6KX9ev5m8jfl/DTOjWWxi7Obbz7ABdrP/AhdW3qpgcssdtNZJpwPRPAEdqoPC2\nyzhiYSoSDaYDlnlAsDBXh55Jux+EQECtTkGJYvSlOGSTOY3D6ElqP/4PJRNxcxv9\nMZY7XFbayfeCUPq02ZSe8lQm\n-----END PRIVATE KEY-----\n"",
			  ""client_email"": ""firebase-adminsdk-fbsvc@sia-aspapi.iam.gserviceaccount.com"",
			  ""client_id"": ""101462445364505871080"",
			  ""auth_uri"": ""https://accounts.google.com/o/oauth2/auth"",
			  ""token_uri"": ""https://oauth2.googleapis.com/token"",
			  ""auth_provider_x509_cert_url"": ""https://www.googleapis.com/oauth2/v1/certs"",
			  ""client_x509_cert_url"": ""https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sia-aspapi.iam.gserviceaccount.com"",
			  ""universe_domain"": ""googleapis.com""
			}";

			var stream = new MemoryStream(Encoding.UTF8.GetBytes(firebaseKey));

			var credential = GoogleCredential.FromStream(stream);
			if (FirebaseApp.DefaultInstance == null)
			{
				FirebaseApp.Create(new AppOptions
				{
					Credential = credential
				});
			}

			_firestore = FirestoreDb.Create("sia-aspapi");

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
