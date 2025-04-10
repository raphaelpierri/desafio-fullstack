using EmpresaFornecedor.Application.DTOs;
using EmpresaFornecedor.Application.Mapping;
using EmpresaFornecedor.Application.Services;
using EmpresaFornecedor.Infrastructure.Context;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Listen(IPAddress.Any, 5000);
});


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<EmpresaService>();
builder.Services.AddScoped<FornecedorService>();

builder.Services.AddHttpClient<FornecedorService>();

builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

builder.Services.AddValidatorsFromAssemblyContaining<FornecedorCreateDtoValidator>();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

builder.Services.AddControllers();
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();


app.MapControllers();
app.MapRazorPages();

app.Run();
