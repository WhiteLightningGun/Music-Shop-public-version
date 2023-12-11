using Backend.Data;
using Backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddTransient<IEmailSender, EmailServiceDevelopmentMode>();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

builder.Services.AddDbContext<DataContext>(options =>
options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection")));

builder.Services.AddHttpClient();
builder.Services.AddHttpContextAccessor();
builder.Services.AddAuthorization();

var clientUrl = builder.Configuration.GetSection("ClientURL").Value;

builder.Services.AddCors(options => options.AddPolicy("CorsPolicy",
    builder => builder.AllowAnyMethod().AllowAnyHeader().WithOrigins(clientUrl!)));

builder.Services.AddScoped<SignInManager<IdentityUser>>();

builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<DataContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.MapIdentityApi<IdentityUser>();

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();

app.MapControllers();

app.Run();
