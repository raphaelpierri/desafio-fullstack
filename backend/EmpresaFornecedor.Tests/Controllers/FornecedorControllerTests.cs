using Xunit;
using Moq;
using EmpresaFornecedor.API.Controllers;
using EmpresaFornecedor.Application.Services;
using Microsoft.AspNetCore.Mvc;
using EmpresaFornecedor.Application.DTOs.Fornecedor;
using EmpresaFornecedor.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EmpresaFornecedor.Tests.Controllers;

public class FornecedorControllerTests
{
    private readonly FornecedorController _controller;
    private readonly Mock<FornecedorService> _serviceMock = new();

    public FornecedorControllerTests()
    {
        _controller = new FornecedorController(_serviceMock.Object);
    }

    [Fact]
    public async Task GetAll_WithParams_ReturnsOk()
    {
        _serviceMock.Setup(s => s.GetFilteredAsync("João", "123"))
            .ReturnsAsync(new List<Fornecedor>());

        var result = await _controller.GetAll("João", "123");

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task Create_ReturnsOk()
    {
        var dto = new FornecedorCreateDto
        {
            Documento = "12345678901",
            Nome = "Teste",
            Email = "teste@email.com",
            Cep = "80000000",
            Rg = "1234567",
            DataNascimento = DateOnly.FromDateTime(DateTime.Parse("2000-01-01"))
        };

        _serviceMock.Setup(s => s.CreateAsync(dto, It.IsAny<int>()))
            .Returns(Task.CompletedTask);

        var result = await _controller.Create(1, dto);

        Assert.IsType<OkObjectResult>(result);
    }
}
