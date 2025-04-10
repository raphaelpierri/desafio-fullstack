using AutoMapper;
using EmpresaFornecedor.Application.DTOs.Fornecedor;
using EmpresaFornecedor.Domain.Entities;
using EmpresaFornecedor.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace EmpresaFornecedor.Application.Services
{
    public class FornecedorService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public FornecedorService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<FornecedorDto>> GetAllAsync()
        {
            var fornecedores = await _context.Fornecedores
                .Include(f => f.Empresas)
                .ThenInclude(fe => fe.Empresa)
                .ToListAsync();

            return fornecedores.Select(f =>
            {
                var dto = _mapper.Map<FornecedorDto>(f);
                dto.Empresas = f.Empresas.Select(e => e.EmpresaId).ToList();
                return dto;
            }).ToList();
        }

        public async Task<FornecedorDto?> GetByIdAsync(int id)
        {
            var fornecedor = await _context.Fornecedores
                .Include(f => f.Empresas)
                .ThenInclude(fe => fe.Empresa)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (fornecedor == null) return null;

            var dto = _mapper.Map<FornecedorDto>(fornecedor);
            dto.Empresas = fornecedor.Empresas.Select(e => e.EmpresaId).ToList();
            return dto;
        }

        public async Task<FornecedorDto> CreateAsync(FornecedorCreateDto dto)
        {
            bool documentoJaExiste = await _context.Fornecedores.AnyAsync(f => f.Documento == dto.Documento);
            if (documentoJaExiste)
                throw new InvalidOperationException($"Já existe um fornecedor com o documento {dto.Documento}");


            var fornecedor = _mapper.Map<Fornecedor>(dto);
            fornecedor.Empresas = new List<FornecedorEmpresa>();

            if (dto.Empresas != null)
            {
                foreach (var empresaId in dto.Empresas.Where(id => id > 0))
                {
                    fornecedor.Empresas.Add(new FornecedorEmpresa
                    {
                        EmpresaId = empresaId,
                        FornecedorId = fornecedor.Id
                    });
                }
            }

            _context.Fornecedores.Add(fornecedor);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(fornecedor.Id) ?? throw new Exception("Erro ao buscar o fornecedor criado.");
        }

        public async Task<FornecedorDto?> UpdateAsync(int id, FornecedorCreateDto dto)
        {
            bool documentoJaExiste = await _context.Fornecedores
                .AnyAsync(f => f.Documento == dto.Documento && f.Id != id);

            if (documentoJaExiste)
                throw new InvalidOperationException($"Já existe outro fornecedor com o documento {dto.Documento}");

            var fornecedor = await _context.Fornecedores
                .Include(f => f.Empresas)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (fornecedor == null) return null;

            fornecedor.Documento = dto.Documento;
            fornecedor.Nome = dto.Nome;
            fornecedor.Email = dto.Email;
            fornecedor.Cep = dto.Cep;
            fornecedor.Rg = dto.Rg!;
            fornecedor.DataNascimento = fornecedor.DataNascimento = dto.DataNascimento ?? default(DateOnly);

            fornecedor.Empresas.Clear();

            if (dto.Empresas != null)
            {
                foreach (var empresaId in dto.Empresas.Where(id => id > 0))
                {
                    fornecedor.Empresas.Add(new FornecedorEmpresa
                    {
                        EmpresaId = empresaId,
                        FornecedorId = fornecedor.Id
                    });
                }
            }

            await _context.SaveChangesAsync();

            return await GetByIdAsync(fornecedor.Id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var fornecedor = await _context.Fornecedores.FindAsync(id);
            if (fornecedor == null) return false;

            _context.Fornecedores.Remove(fornecedor);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
