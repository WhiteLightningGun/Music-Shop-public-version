using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity.UI.Services;
using MimeKit;
using MimeKit.IO;
using Backend.EmailTemplates;
using Backend.Configuration;
using Microsoft.Extensions.Options;
using Backend.Models;
using RazorLight;
using Backend.Data;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services
{
    public class EmailService : IEmailSender, IEmailSender<IdentityUser>
    {
        private readonly IHostEnvironment _environment;
        private readonly MailSettings _settings;
        public EmailService(IHostEnvironment environment, IOptions<MailSettings> settings)
        {
            _environment = environment;
            _settings = settings.Value;
        }
        
        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            List<string> recipients = new() { email };
            string htmlMessageBody = await GetHtmlEmailString(htmlMessage, email);
            MailData mailData = new(to: recipients, subject: subject, body: htmlMessageBody);

            bool sendAttemptSuccessful = await SendAsync(mailData);

            if(sendAttemptSuccessful)
            {
                Console.WriteLine("Mail == Sent, via SendEmailAsync");
            }
            else
            {
                Console.WriteLine($"mail error: ");
            }

            await Task.CompletedTask;
        }

        public async Task SendPasswordResetCodeAsync(IdentityUser user, string email, string resetCode)
        {
            List<string> recipients = new() { email };
            string htmlMessageBody = await GetHtmlEmailReset(resetCode, user.UserName!);
            MailData mailData = new(to: recipients, subject: "Password Reset", body: htmlMessageBody);

            bool sendAttemptSuccessful = await SendAsync(mailData);

            if(sendAttemptSuccessful)
            {
                Console.WriteLine("Mail == Sent, via SendPasswordResetCodeAsync");
            }
            else
            {
                Console.WriteLine($"mail error: ");
            }
            await Task.CompletedTask;
        }

        public async Task<string> GetHtmlEmailString(string htmlMessageBody, string userName)
        {
            BasicEmailModel model = new()
            {
                Name = $"{userName}",
                Data = $"{htmlMessageBody}"
            };
            string razorTemplatePath = Path.Combine(Directory.GetCurrentDirectory(), "EmailRazorTemplates", "BasicEmail.cshtml");
            // Use Razor to generate the HTML body
            var engine = new RazorLightEngineBuilder()
            .UseFileSystemProject(Path.GetDirectoryName(razorTemplatePath))
            .UseMemoryCachingProvider()
            .Build();

            string result = await engine.CompileRenderAsync(Path.GetFileName(razorTemplatePath), model);
            return result;
        }

        public async Task<string> GetHtmlEmailReset(string resetCode, string userName)
        {
            BasicEmailModel model = new()
            {
                Name = $"{userName}",
                Data = $"{resetCode}"
            };
            string razorTemplatePath = Path.Combine(Directory.GetCurrentDirectory(), "EmailRazorTemplates", "PasswordResetEmail.cshtml");
            // Use Razor to generate the HTML body
            var engine = new RazorLightEngineBuilder()
            .UseFileSystemProject(Path.GetDirectoryName(razorTemplatePath))
            .UseMemoryCachingProvider()
            .Build();

            string result = await engine.CompileRenderAsync(Path.GetFileName(razorTemplatePath), model);
            return result;
        }

        public async Task<bool> SendAsync(MailData mailData, CancellationToken ct = default)
        {
            try
            {
                // Initialize a new instance of the MimeKit.MimeMessage class
                var mail = new MimeMessage();

                #region Sender / Receiver
                // Sender
                mail.From.Add(new MailboxAddress(_settings.DisplayName, mailData.From ?? _settings.From));
                mail.Sender = new MailboxAddress(mailData.DisplayName ?? _settings.DisplayName, mailData.From ?? _settings.From);

                // Receiver
                foreach (string mailAddress in mailData.To)
                    mail.To.Add(MailboxAddress.Parse(mailAddress));

                // Set Reply to if specified in mail data
                if(!string.IsNullOrEmpty(mailData.ReplyTo))
                    mail.ReplyTo.Add(new MailboxAddress(mailData.ReplyToName, mailData.ReplyTo));

                // BCC
                // Check if a BCC was supplied in the request
                if (mailData.Bcc != null)
                {
                    // Get only addresses where value is not null or with whitespace. x = value of address
                    foreach (string mailAddress in mailData.Bcc.Where(x => !string.IsNullOrWhiteSpace(x)))
                        mail.Bcc.Add(MailboxAddress.Parse(mailAddress.Trim()));
                }

                // CC
                // Check if a CC address was supplied in the request
                if (mailData.Cc != null)
                {
                    foreach (string mailAddress in mailData.Cc.Where(x => !string.IsNullOrWhiteSpace(x)))
                        mail.Cc.Add(MailboxAddress.Parse(mailAddress.Trim()));
                }
                #endregion

                #region Content

                // Add Content to Mime Message
                var body = new BodyBuilder();
                mail.Subject = mailData.Subject;
                body.HtmlBody = mailData.Body;
                mail.Body = body.ToMessageBody();

                #endregion

                #region Send Mail

                using var smtp = new SmtpClient();

                if (_settings.UseSSL)
                {
                    await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.SslOnConnect, ct);
                }
                else if (_settings.UseStartTls)
                {
                    await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls, ct);
                }
                await smtp.AuthenticateAsync(_settings.UserName, _settings.Password, ct);
                await smtp.SendAsync(mail, ct);
                await smtp.DisconnectAsync(true, ct);
                
                #endregion

                var pickupDirectory = Path.Combine(_environment.ContentRootPath, "TempMail");
                await SaveToPickupDirectory(mail, pickupDirectory); 

                return true;

            }
            catch (Exception except)
            {
                Console.WriteLine(except.Message);
                return false;
            }
        }

        public static async Task SaveToPickupDirectory(MimeMessage message, string pickupDirectory)
        {
            do
            {
                var path = Path.Combine(pickupDirectory, Guid.NewGuid().ToString() + ".eml");
                Stream stream;

                try
                {
                    stream = File.Open(path, FileMode.CreateNew);
                }
                catch (IOException)
                {
                    if (File.Exists(path))
                        continue;
                    throw;
                }

                try
                {
                    using (stream)
                    {
                        using var filtered = new FilteredStream(stream);
                        filtered.Add(new SmtpDataFilter());

                        var options = FormatOptions.Default.Clone();
                        options.NewLineFormat = NewLineFormat.Dos;

                        await message.WriteToAsync(options, filtered);
                        await filtered.FlushAsync();
                        return;
                    }
                }
                catch
                {
                    File.Delete(path);
                    throw;
                }
            } while (true);
        }

        public Task SendConfirmationLinkAsync(IdentityUser user, string email, string confirmationLink)
        {
            throw new NotImplementedException();
        }

        public Task SendPasswordResetLinkAsync(IdentityUser user, string email, string resetLink)
        {
            throw new NotImplementedException();
        }
    }

}