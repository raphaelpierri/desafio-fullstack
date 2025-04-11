using EmpresaFornecedor.Application.DTOs.Empresa;
using EmpresaFornecedor.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmpresaFornecedor.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpresaController : ControllerBase
    {
        private readonly EmpresaService _empresaService;

        public EmpresaController(EmpresaService empresaService)
        {
            _empresaService = empresaService;
        }

        [HttpGet]
        public async Task<ActionResult<List<EmpresaDto>>> GetAll()
        {
            return Ok(await _empresaService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmpresaDto>> GetById(int id)
        {
            var empresa = await _empresaService.GetByIdAsync(id);
            if (empresa == null) return NotFound();
            return Ok(empresa);
        }

        [HttpPost]
        public async Task<ActionResult<EmpresaDto>> Create([FromBody] EmpresaCreateDto dto)
        {
            try
            {
                var created = await _empresaService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }


        [HttpPut("{id}")]
        public async Task<ActionResult<EmpresaDto>> Update(int id, [FromBody] EmpresaCreateDto dto)
        {
            try
            {
                var updated = await _empresaService.UpdateAsync(id, dto);
                if (updated == null) return NotFound();
                return Ok(updated);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message }); // HTTP 409
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _empresaService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
