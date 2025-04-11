using EmpresaFornecedor.Application.DTOs.Empresa;
using EmpresaFornecedor.Application.DTOs.Fornecedor;
using EmpresaFornecedor.Domain.Entities;
using EmpresaFornecedor.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace EmpresaFornecedor.Application.Services
{
    public class EmpresaService
    {
        private readonly ApplicationDbContext _context;

        public EmpresaService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<EmpresaDto>> GetAllAsync()
        {
            var empresas = await _context.Empresas
                .Include(e => e.Fornecedores)
                    .ThenInclude(fe => fe.Fornecedor)
                .ToListAsync();

            return empresas.Select(e => new EmpresaDto
            {
                Id = e.Id,
                Cnpj = e.Cnpj,
                NomeFantasia = e.NomeFantasia,
                Cep = e.Cep,
                Fornecedores = e.Fornecedores.Select(f => new FornecedorDto
                {
                    Id = f.Fornecedor.Id,
                    Nome = f.Fornecedor.Nome,
                    Documento = f.Fornecedor.Documento,
                    Email = f.Fornecedor.Email,
                    Cep = f.Fornecedor.Cep
                }).ToList()
            }).ToList();
        }

        public async Task<EmpresaDto?> GetByIdAsync(int id)
        {
            var empresa = await _context.Empresas
                .Include(e => e.Fornecedores)
                    .ThenInclude(fe => fe.Fornecedor)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (empresa == null) return null;

            return new EmpresaDto
            {
                Id = empresa.Id,
                Cnpj = empresa.Cnpj,
                NomeFantasia = empresa.NomeFantasia,
                Cep = empresa.Cep,
                Fornecedores = empresa.Fornecedores.Select(f => new FornecedorDto
                {
                    Id = f.Fornecedor.Id,
                    Nome = f.Fornecedor.Nome,
                    Documento = f.Fornecedor.Documento,
                    Email = f.Fornecedor.Email,
                    Cep = f.Fornecedor.Cep
                }).ToList()
            };
        }

        public async Task<EmpresaDto> CreateAsync(EmpresaCreateDto dto)
        {
            if (await _context.Empresas.AnyAsync(e => e.Cnpj == dto.Cnpj))
                throw new InvalidOperationException($"Já existe uma empresa com o CNPJ {dto.Cnpj}");

            var empresa = new Empresa
            {
                Cnpj = dto.Cnpj,
                NomeFantasia = dto.NomeFantasia,
                Cep = dto.Cep,
                Fornecedores = new List<FornecedorEmpresa>()
            };

            if (dto.Fornecedores != null)
            {
                foreach (var fornecedorId in dto.Fornecedores.Where(id => id > 0))
                {
                    empresa.Fornecedores.Add(new FornecedorEmpresa
                    {
                        Empresa = empresa,
                        FornecedorId = fornecedorId
                    });
                }
            }

            _context.Empresas.Add(empresa);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(empresa.Id) ?? throw new Exception("Erro ao buscar empresa criada.");
        }

        public async Task<EmpresaDto?> UpdateAsync(int id, EmpresaCreateDto dto)
        {
            var empresa = await _context.Empresas
                .Include(e => e.Fornecedores)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (empresa == null) return null;

            bool cnpjJaExiste = await _context.Empresas
                .AnyAsync(e => e.Cnpj == dto.Cnpj && e.Id != id);

            if (cnpjJaExiste)
                throw new InvalidOperationException($"Já existe uma empresa com o CNPJ {dto.Cnpj}");


            empresa.Cnpj = dto.Cnpj;
            empresa.NomeFantasia = dto.NomeFantasia;
            empresa.Cep = dto.Cep;

            var fornecedoresExistentes = _context.FornecedorEmpresa
                .Where(fe => fe.EmpresaId == id);
            _context.FornecedorEmpresa.RemoveRange(fornecedoresExistentes);

            if (dto.Fornecedores != null)
            {
                foreach (var fornecedorId in dto.Fornecedores.Where(id => id > 0))
                {
                    _context.FornecedorEmpresa.Add(new FornecedorEmpresa
                    {
                        EmpresaId = id,
                        FornecedorId = fornecedorId
                    });
                }
            }

            await _context.SaveChangesAsync();

            return await GetByIdAsync(id);
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
