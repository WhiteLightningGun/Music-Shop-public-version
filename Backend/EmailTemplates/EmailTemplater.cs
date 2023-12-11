using Microsoft.AspNetCore.Hosting.Server;

namespace Backend.EmailTemplates
{
    public class EmailTemplater
    {
        public string firstHalf { get; set; }
        public string secondHalf { get; set; }
        private static string MainDirectory = Environment.CurrentDirectory;

        public EmailTemplater()
        {
            string pathA = $"{MainDirectory}/EmailTemplates/first_half.txt";
            string pathB = $"{MainDirectory}/EmailTemplates/second_half.txt";

            string emailFirstHalf = new StreamReader(pathA).ReadToEnd();
            string emailSecondHalf = new StreamReader(pathB).ReadToEnd();
            firstHalf = emailFirstHalf!;
            secondHalf = emailSecondHalf!;
        }

        public string CreateEmailString(string emailBody)
        {
            var fullEmail = $"{firstHalf}{emailBody}{secondHalf}";
            return fullEmail;
        }
    }
}
