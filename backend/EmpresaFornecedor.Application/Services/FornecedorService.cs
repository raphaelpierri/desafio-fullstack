using AutoMapper;
using EmpresaFornecedor.Application.DTOs.Fornecedor;
using EmpresaFornecedor.Domain.Entities;
using EmpresaFornecedor.Infrastructure.Context;
using EmpresaFornecedor.Application.Validators;
using Microsoft.EntityFrameworkCore;

namespace EmpresaFornecedor.Application.Services
{
    public class FornecedorService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;

        public FornecedorService(ApplicationDbContext context, IMapper mapper, HttpClient httpClient)
        {
            _context = context;
            _mapper = mapper;
            _httpClient = httpClient;
        }

        public async Task<List<FornecedorDto>> GetAllAsync()
        {
            var fornecedores = await _context.Fornecedores
                .Include(f => f.Empresas)
                .ThenInclude(fe => fe.Empresa)
                .ToListAsync();

            return _mapper.Map<List<FornecedorDto>>(fornecedores);
        }

        public async Task<FornecedorDto?> GetByIdAsync(int id)
        {
            var fornecedor = await _context.Fornecedores
                .Include(f => f.Empresas)
                .ThenInclude(fe => fe.Empresa)
                .FirstOrDefaultAsync(f => f.Id == id);

            return fornecedor is null ? null : _mapper.Map<FornecedorDto>(fornecedor);
        }

        public async Task<FornecedorDto> CreateAsync(FornecedorCreateDto dto)
        {
            if (!await CepValidator.ValidarAsync(dto.Cep, _httpClient))
                throw new ArgumentException("CEP inválido.");

            var fornecedor = _mapper.Map<Fornecedor>(dto);

            if (dto.EmpresaIds != null && dto.EmpresaIds.Any())
            {
                var empresas = await _context.Empresas
                    .Where(e => dto.EmpresaIds.Contains(e.Id))
                    .ToListAsync();

                foreach (var empresa in empresas)
                {
                    RegraParanaValidator.Validar(empresa, fornecedor);

                    fornecedor.Empresas.Add(new FornecedorEmpresa
                    {
                        EmpresaId = empresa.Id,
                        Fornecedor = fornecedor
                    });
                }
            }

            _context.Fornecedores.Add(fornecedor);
            await _context.SaveChangesAsync();

            return _mapper.Map<FornecedorDto>(fornecedor);
        }

        public async Task<bool> UpdateAsync(int id, FornecedorUpdateDto dto)
        {
            if (!await CepValidator.ValidarAsync(dto.Cep, _httpClient))
                throw new ArgumentException("CEP inválido.");

            var fornecedor = await _context.Fornecedores
                .Include(f => f.Empresas)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (fornecedor is null)
                return false;

            _mapper.Map(dto, fornecedor);

            if (dto.EmpresaIds != null && dto.EmpresaIds.Any())
            {
                var empresas = await _context.Empresas
                    .Where(e => dto.EmpresaIds.Contains(e.Id))
                    .ToListAsync();

                foreach (var empresa in empresas)
                {
                    RegraParanaValidator.Validar(empresa, fornecedor);

                    fornecedor.Empresas.Add(new FornecedorEmpresa
                    {
                        EmpresaId = empresa.Id,
                        FornecedorId = fornecedor.Id
                    });
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var fornecedor = await _context.Fornecedores.FindAsync(id);
            if (fornecedor is null) return false;

            _context.Fornecedores.Remove(fornecedor);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
