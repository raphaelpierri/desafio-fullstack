// EmpresaController.cs
using Microsoft.AspNetCore.Mvc;
using EmpresaFornecedor.Application.DTOs.Empresa;
using EmpresaFornecedor.Application.Services;

namespace EmpresaFornecedor.API.Controllers
{
    [ApiController]
    [Route("api/empresa")]
    public class EmpresaController : ControllerBase
    {
        private readonly EmpresaService _empresaService;

        public EmpresaController(EmpresaService empresaService)
        {
            _empresaService = empresaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var empresas = await _empresaService.GetAllAsync();
            return Ok(empresas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var empresa = await _empresaService.GetByIdAsync(id);
            return empresa == null ? NotFound() : Ok(empresa);
        }

        [HttpPost]
        public async Task<IActionResult> Create(EmpresaCreateDto dto)
        {
            var empresa = await _empresaService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = empresa.Id }, empresa); // <- 201 + JSON
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EmpresaUpdateDto dto)
        {
            bool atualizado = await _empresaService.UpdateAsync(id, dto);
            if (!atualizado)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _empresaService.DeleteAsync(id);
            return Ok("Empresa deletada com sucesso.");
        }
    }
}
