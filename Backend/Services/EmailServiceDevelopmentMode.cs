using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity.UI.Services;
using MimeKit;
using MimeKit.IO;
using Backend.EmailTemplates;

namespace Backend.Services
{
    public class EmailServiceDevelopmentMode : IEmailSender
    {
        private readonly IHostEnvironment _environment;
        public EmailServiceDevelopmentMode(IHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var pickupDirectory = Path.Combine(_environment.ContentRootPath, "TempMail");
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse("EmailServiceDevelopmentMode@backend.com"));
            message.To.Add(MailboxAddress.Parse(email));
            message.Subject = subject;

            EmailTemplater Templater = new EmailTemplater();
            string fullMessage = Templater.CreateEmailString(htmlMessage); // Interpolate htmlMessage with email string loaded from... txt file?

            message.Body = new TextPart("html")
            {
                Text = fullMessage //interpolated string here to create basic html template
            };

            await SaveToPickupDirectory(message, pickupDirectory); //Send the email to a folder in this project!!!
            await Task.CompletedTask;

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

    }
}
