using EmpresaFornecedor.Application.Services;
using EmpresaFornecedor.Application.DTOs.Fornecedor;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

[ApiController]
[Route("fornecedores")]
public class FornecedorController : ControllerBase
{
    private readonly FornecedorService _service;

    public FornecedorController(FornecedorService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(string? nome, string? documento)
    {
        var result = await _service.GetFilteredAsync(nome, documento);
        return Ok(result);
    }

    [HttpPost("{empresaId}")]
    public async Task<IActionResult> Create(int empresaId, [FromBody] FornecedorCreateDto dto)
    {
        await _service.CreateAsync(dto, empresaId);
        return Ok("Fornecedor criado com sucesso.");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
