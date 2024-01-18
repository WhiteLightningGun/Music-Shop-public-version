using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Backend.Controllers;
using Backend.Data;
using Microsoft.AspNetCore.Hosting.Server;

public class MusicControllerTests
{
    [Fact]
    public void GetMusicDownload_ShouldRejectAnonymousRequest()
    {
        // Arrange
        var controller = new MusicController(new Mock<IServer>().Object, new Mock<DataContext>().Object);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };

        // Act
        var result = controller.GetMusicDownload("12345678");

        // Assert
        Assert.IsType<UnauthorizedResult>(result);
    }
}