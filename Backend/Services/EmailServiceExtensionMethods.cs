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
using System.Net;

namespace Backend.Services;

public static class EmailSenderExtensions
{
    public static async Task SendOrderConfirmation(this IEmailSender emailSender, string email, string orderID, List<string> musicList)
    {
        string subject = $"Order Confirmation: {orderID}";
        string htmlMessageBody = await GetHtmlEmailOrderConfirmation(orderID, email, musicList);
        await emailSender.SendEmailAsync(email, subject, htmlMessageBody);
        await Task.CompletedTask;
    }

    public static async Task<string> GetHtmlEmailOrderConfirmation(string orderID, string userName, List<string> musicList)
        {
            OrderConfirmationEmailModel model = new()
            {
                Name = $"{userName}",
                OrderID = $"{orderID}",
                MusicList = musicList
            };
            string razorTemplatePath = Path.Combine(Directory.GetCurrentDirectory(), "EmailRazorTemplates", "OrderConfirmationEmail.cshtml");
            // Use Razor to generate the HTML body
            var engine = new RazorLightEngineBuilder()
            .UseFileSystemProject(Path.GetDirectoryName(razorTemplatePath))
            .UseMemoryCachingProvider()
            .Build();

            string result = await engine.CompileRenderAsync(Path.GetFileName(razorTemplatePath), model);
            return result;
        }
}