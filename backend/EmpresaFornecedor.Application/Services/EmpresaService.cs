using AutoMapper;
using EmpresaFornecedor.Application.DTOs.Empresa;
using EmpresaFornecedor.Domain.Entities;
using EmpresaFornecedor.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace EmpresaFornecedor.Application.Services
{
    public class EmpresaService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public EmpresaService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<EmpresaDto>> GetAllAsync()
        {
            var empresas = await _context.Empresas
                .Include(e => e.Fornecedores)
                .ThenInclude(fe => fe.Fornecedor)
                .ToListAsync();

            return _mapper.Map<List<EmpresaDto>>(empresas);
        }

        public async Task<EmpresaDto?> GetByIdAsync(int id)
        {
            var empresa = await _context.Empresas
                .Include(e => e.Fornecedores)
                .ThenInclude(fe => fe.Fornecedor)
                .FirstOrDefaultAsync(e => e.Id == id);

            return empresa is null ? null : _mapper.Map<EmpresaDto>(empresa);
        }

        public async Task<EmpresaDto> CreateAsync(EmpresaCreateDto dto)
        {
            var empresa = _mapper.Map<Empresa>(dto);
            empresa.Fornecedores = null;

            _context.Empresas.Add(empresa);
            await _context.SaveChangesAsync();

            if (dto.FornecedorIds != null && dto.FornecedorIds.Any())
            {
                var relacoes = dto.FornecedorIds.Select(fornecedorId => new FornecedorEmpresa
                {
                    EmpresaId = empresa.Id,
                    FornecedorId = fornecedorId
                });

                await _context.FornecedorEmpresa.AddRangeAsync(relacoes);
                await _context.SaveChangesAsync();
            }

            // ✅ Retorna objeto
            return _mapper.Map<EmpresaDto>(empresa);
        }

        public async Task<bool> UpdateAsync(int id, EmpresaUpdateDto dto)
        {
            var empresa = await _context.Empresas
                .Include(e => e.Fornecedores)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (empresa == null)
                return false;

            _mapper.Map(dto, empresa);
            await _context.SaveChangesAsync();

            // Remove relacionamentos antigos
            var relacoesAntigas = _context.FornecedorEmpresa
                .Where(fe => fe.EmpresaId == empresa.Id);
            _context.FornecedorEmpresa.RemoveRange(relacoesAntigas);

            // Adiciona novos relacionamentos
            if (dto.FornecedorIds != null && dto.FornecedorIds.Any())
            {
                var novasRelacoes = dto.FornecedorIds.Select(fornecedorId => new FornecedorEmpresa
                {
                    EmpresaId = empresa.Id,
                    FornecedorId = fornecedorId
                });

                await _context.FornecedorEmpresa.AddRangeAsync(novasRelacoes);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var empresa = await _context.Empresas.FindAsync(id);
            if (empresa is null) return false;

            _context.Empresas.Remove(empresa);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
