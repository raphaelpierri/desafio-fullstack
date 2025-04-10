using Microsoft.AspNetCore.Mvc;
using EmpresaFornecedor.Application.DTOs.Fornecedor;
using EmpresaFornecedor.Application.Services;

namespace EmpresaFornecedor.API.Controllers
{
    [ApiController]
    [Route("api/fornecedor")]
    public class FornecedorController : ControllerBase
    {
        private readonly FornecedorService _fornecedorService;

        public FornecedorController(FornecedorService fornecedorService)
        {
            _fornecedorService = fornecedorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var fornecedores = await _fornecedorService.GetAllAsync();
            return Ok(fornecedores);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var fornecedor = await _fornecedorService.GetByIdAsync(id);
            return fornecedor is null ? NotFound() : Ok(fornecedor);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] FornecedorCreateDto dto)
        {
            await _fornecedorService.CreateAsync(dto);
            return Ok("Fornecedor criado com sucesso.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, FornecedorUpdateDto dto)
        {
            await _fornecedorService.UpdateAsync(id, dto);
            return Ok("Fornecedor atualizado com sucesso.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _fornecedorService.DeleteAsync(id);
            return Ok("Fornecedor deletado com sucesso.");
        }
    }
}
