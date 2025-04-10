using Xunit;
using Moq;
using EmpresaFornecedor.API.Controllers;
using EmpresaFornecedor.Application.Services;
using Microsoft.AspNetCore.Mvc;
using EmpresaFornecedor.Domain.Entities;

namespace EmpresaFornecedor.Tests.Controllers;

public class EmpresaControllerTests
{
    private readonly EmpresaController _controller;
    private readonly Mock<EmpresaService> _serviceMock = new();

    public EmpresaControllerTests()
    {
        _controller = new EmpresaController(_serviceMock.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOkResult()
    {
        _serviceMock.Setup(s => s.GetAllAsync())
            .ReturnsAsync(new List<Empresa>());

        var result = await _controller.GetAll();

        Assert.IsType<OkObjectResult>(result);
    }
}
