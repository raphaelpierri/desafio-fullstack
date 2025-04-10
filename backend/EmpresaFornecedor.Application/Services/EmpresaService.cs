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

            return empresas.Select(e =>
            {
                var dto = _mapper.Map<EmpresaDto>(e);
                dto.Fornecedores = e.Fornecedores.Select(f => f.FornecedorId).ToList();
                return dto;
            }).ToList();
        }

        public async Task<EmpresaDto?> GetByIdAsync(int id)
        {
            var empresa = await _context.Empresas
                .Include(e => e.Fornecedores)
                .ThenInclude(fe => fe.Fornecedor)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (empresa == null) return null;

            var dto = _mapper.Map<EmpresaDto>(empresa);
            dto.Fornecedores = empresa.Fornecedores.Select(f => f.FornecedorId).ToList();
            return dto;
        }

        public async Task<EmpresaDto> CreateAsync(EmpresaCreateDto dto)
        {
            bool cnpjJaExiste = await _context.Empresas.AnyAsync(e => e.Cnpj == dto.Cnpj);
            if (cnpjJaExiste)
                throw new InvalidOperationException($"Já existe uma empresa com o CNPJ {dto.Cnpj}");

            var empresa = _mapper.Map<Empresa>(dto);
            empresa.Fornecedores = new List<FornecedorEmpresa>();

            if (dto.Fornecedores != null)
            {
                foreach (var fornecedorId in dto.Fornecedores.Where(id => id > 0))
                {
                    empresa.Fornecedores.Add(new FornecedorEmpresa
                    {
                        EmpresaId = empresa.Id,
                        FornecedorId = fornecedorId
                    });
                }
            }

            _context.Empresas.Add(empresa);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(empresa.Id) ?? throw new Exception("Erro ao buscar a empresa criada.");
        }

        public async Task<EmpresaDto?> UpdateAsync(int id, EmpresaCreateDto dto)
        {

            bool cnpjJaExiste = await _context.Empresas.AnyAsync(e => e.Cnpj == dto.Cnpj);
            if (cnpjJaExiste)
                throw new InvalidOperationException($"Já existe uma empresa com o CNPJ {dto.Cnpj}");

            var empresa = await _context.Empresas
                .Include(e => e.Fornecedores)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (empresa == null) return null;


            empresa.Cnpj = dto.Cnpj;
            empresa.NomeFantasia = dto.NomeFantasia;
            empresa.Cep = dto.Cep;

            empresa.Fornecedores.Clear();

            if (dto.Fornecedores != null)
            {
                foreach (var fornecedorId in dto.Fornecedores.Where(id => id > 0))
                {
                    empresa.Fornecedores.Add(new FornecedorEmpresa
                    {
                        EmpresaId = empresa.Id,
                        FornecedorId = fornecedorId
                    });
                }
            }

            await _context.SaveChangesAsync();

            return await GetByIdAsync(empresa.Id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var empresa = await _context.Empresas.FindAsync(id);
            if (empresa == null) return false;

            _context.Empresas.Remove(empresa);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
