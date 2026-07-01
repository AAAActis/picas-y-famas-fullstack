using System.ComponentModel.DataAnnotations;

namespace PicasYFamas.DateTransferObjects
{
    public class RegisterPlayerRequest
    {
        [Required] public string FirstName { get; set; }
        [Required] public string LastName { get; set; }
        [Required] public int Age { get; set; }
        [Required][EmailAddress] public string Email { get; set; }
        [Required] public string Password { get; set; }
    }
}