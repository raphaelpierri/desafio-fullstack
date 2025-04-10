using EmpresaFornecedor.Application.DTOs.Fornecedor;
using EmpresaFornecedor.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmpresaFornecedor.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FornecedorController : ControllerBase
    {
        private readonly FornecedorService _fornecedorService;

        public FornecedorController(FornecedorService fornecedorService)
        {
            _fornecedorService = fornecedorService;
        }

        [HttpGet]
        public async Task<ActionResult<List<FornecedorDto>>> GetAll()
        {
            return Ok(await _fornecedorService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FornecedorDto>> GetById(int id)
        {
            var fornecedor = await _fornecedorService.GetByIdAsync(id);
            if (fornecedor == null) return NotFound();
            return Ok(fornecedor);
        }

        [HttpPost]
        public async Task<ActionResult<FornecedorDto>> Create([FromBody] FornecedorCreateDto dto)
        {
            try
            {
                var created = await _fornecedorService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<FornecedorDto>> Update(int id, [FromBody] FornecedorCreateDto dto)
        {
            try
            {
                var updated = await _fornecedorService.UpdateAsync(id, dto);
                if (updated == null) return NotFound();
                return Ok(updated);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _fornecedorService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
