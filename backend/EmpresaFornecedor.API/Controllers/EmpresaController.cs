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
            await _empresaService.CreateAsync(dto);
            return Ok("Empresa criada com sucesso.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EmpresaUpdateDto dto)
        {
            await _empresaService.UpdateAsync(id, dto);
            return Ok("Empresa atualizada com sucesso.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _empresaService.DeleteAsync(id);
            return Ok("Empresa deletada com sucesso.");
        }
    }
}
