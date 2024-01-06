using System.Threading.Tasks;

namespace Microsoft.AspNetCore.Identity.UI.Services
{

    public interface IEmailService
    {

        Task SendEmailAsync(string email, string subject, string htmlMessage);
        Task SendPasswordResetEmail(string email, string subject, string resetCode);
    }
}