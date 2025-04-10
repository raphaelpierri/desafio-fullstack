using EmpresaFornecedor.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using EmpresaFornecedor.Application.Services;
using EmpresaFornecedor.Application.Validators;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSwaggerGen(c =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

// Força o Kestrel a escutar na porta 80 para compatibilidade com o docker-compose
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000);
});

// Adiciona os serviços básicos
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configura o DbContext para usar a connection string do appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registra os serviços da aplicação
builder.Services.AddScoped<EmpresaService>();

// Registra FornecedorService como cliente tipado de HttpClient, assim o HttpClient será injetado
builder.Services.AddHttpClient<FornecedorService>();

// Registra o AutoMapper para escanear os assemblies
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


// (Opcional) Habilita CORS para desenvolvimento
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

// Aplica automaticamente as migrations ao iniciar o app (cria/atualiza o banco se necessário)
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine("Erro ao aplicar migrations: " + ex.Message);
        throw;
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS se necessário (antes dos demais middlewares)
app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
