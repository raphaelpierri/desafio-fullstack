using AutoMapper;
using EmpresaFornecedor.Domain.Entities;
using EmpresaFornecedor.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using EmpresaFornecedor.Application.DTOs.Fornecedor;

namespace EmpresaFornecedor.Application.Services;


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

    public async Task<IEnumerable<Fornecedor>> GetFilteredAsync(string? nome, string? documento)
    {
        var query = _context.Fornecedores.AsQueryable();

        if (!string.IsNullOrWhiteSpace(nome))
            query = query.Where(f => f.Nome.Contains(nome));

        if (!string.IsNullOrWhiteSpace(documento))
            query = query.Where(f => f.Documento == documento);

        return await query.ToListAsync();
    }

    public async Task CreateAsync(FornecedorCreateDto dto, int empresaId)
    {

        if (await _context.Fornecedores.AnyAsync(f => f.Documento == dto.Documento))
            throw new Exception("Documento (CPF/CNPJ) já cadastrado.");


        var cepValido = await ValidarCepAsync(dto.Cep);
        if (!cepValido)
            throw new Exception("CEP inválido ou não encontrado.");


        var empresa = await _context.Empresas.FirstOrDefaultAsync(e => e.Id == empresaId);
        if (empresa == null)
            throw new Exception("Empresa associada não encontrada.");


        var fornecedor = _mapper.Map<Fornecedor>(dto);

        if (empresa.Cep.StartsWith("8") && dto.DataNascimento.HasValue)
        {
            var idade = CalcularIdade(dto.DataNascimento.Value);
            if (idade < 18)
                throw new Exception("Empresa do Paraná não pode cadastrar fornecedor pessoa física menor de idade.");
        }

        _context.Fornecedores.Add(fornecedor);
        _context.FornecedorEmpresa.Add(new FornecedorEmpresa
        {
            EmpresaId = empresaId,
            Fornecedor = fornecedor
        });

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var fornecedor = await _context.Fornecedores.FindAsync(id);
        if (fornecedor == null)
            throw new Exception("Fornecedor não encontrado.");

        _context.Fornecedores.Remove(fornecedor);
        await _context.SaveChangesAsync();
    }

    private async Task<bool> ValidarCepAsync(string cep)
    {
        _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        var response = await _httpClient.GetAsync($"https://cep.la/{cep}");

        return response.IsSuccessStatusCode;
    }

    private int CalcularIdade(DateOnly nascimento)
    {
        var hoje = DateOnly.FromDateTime(DateTime.Now);
        var idade = hoje.Year - nascimento.Year;
        if (nascimento > hoje.AddYears(-idade)) idade--;
        return idade;
    }
}
