using EmpresaFornecedor.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using EmpresaFornecedor.Application.Services;
using System.Reflection;
using System.Net.Http;

var builder = WebApplication.CreateBuilder(args);

// Swagger
builder.Services.AddSwaggerGen(c =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

// Kestrel
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(80);
});

// Add Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Serviços da aplicação
builder.Services.AddScoped<EmpresaService>();
builder.Services.AddScoped<FornecedorService>();
builder.Services.AddHttpClient(); // <-- necessário para HttpClient injetado

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Migrations com retry
using (var scope = app.Services.CreateScope())
{
    var retryCount = 0;
    const int maxRetries = 10;
    const int delaySeconds = 5;

    while (retryCount < maxRetries)
    {
        try
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            db.Database.Migrate();
            break;
        }
        catch (Exception ex)
        {
            retryCount++;
            Console.WriteLine($"Tentativa {retryCount} de {maxRetries} ao aplicar migrations: {ex.Message}");

            if (retryCount == maxRetries)
                throw;

            Thread.Sleep(TimeSpan.FromSeconds(delaySeconds));
        }
    }
}

// Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
app.Run();
