using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;

namespace FirebaseApi.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class FirebaseController : ControllerBase
	{
		private readonly FirestoreDb _firestoreDb;

		public FirebaseController()
		{
			_firestoreDb = FirestoreDb.Create("sia-aspapi");
		}

		[HttpGet("test")]
		public async Task<IActionResult> Test()
		{
			var docRef = _firestoreDb.Collection("test").Document("sample");
			await docRef.SetAsync(new { message = "Hello from Firebase!" });
			return Ok("Document created");
		}
	}
}
