using Microsoft.AspNetCore.Mvc;
using EmpresaFornecedor.Application.Services;
using EmpresaFornecedor.Domain.Entities;

namespace EmpresaFornecedor.API.Controllers;


[ApiController]
[Route("empresas")]
public class EmpresaController : ControllerBase
{
    private readonly EmpresaService _service;

    public EmpresaController(EmpresaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Empresa empresa)
    {
        await _service.CreateAsync(empresa);
        return CreatedAtAction(nameof(GetAll), new { id = empresa.Id }, empresa);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Empresa empresa)
    {
        if (id != empresa.Id) return BadRequest();
        await _service.UpdateAsync(empresa);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }

}
