using Microsoft.AspNetCore.Identity.UI.Services;
using Backend.Models;

namespace Backend.Services
{
    public interface IMailService : IEmailSender
    {
        Task<bool> SendAsync(MailData mailData, CancellationToken ct);
    }
}
