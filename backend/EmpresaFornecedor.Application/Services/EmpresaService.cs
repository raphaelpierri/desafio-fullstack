using EmpresaFornecedor.Domain.Entities;
using EmpresaFornecedor.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace EmpresaFornecedor.Application.Services;


public class EmpresaService
{
    private readonly ApplicationDbContext _context;

    public EmpresaService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Empresa>> GetAllAsync() =>
        await _context.Empresas.Include(e => e.Fornecedores).ToListAsync();

    public async Task<Empresa?> GetByIdAsync(int id) =>
        await _context.Empresas.Include(e => e.Fornecedores)
            .FirstOrDefaultAsync(e => e.Id == id);

    public async Task CreateAsync(Empresa empresa)
    {
        // Exemplo de validação de CNPJ único
        if (_context.Empresas.Any(e => e.Cnpj == empresa.Cnpj))
            throw new Exception("CNPJ já cadastrado.");

        _context.Empresas.Add(empresa);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Empresa empresa)
    {
        _context.Empresas.Update(empresa);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var empresa = await GetByIdAsync(id);
        if (empresa is null) throw new Exception("Empresa não encontrada.");
        _context.Empresas.Remove(empresa);
        await _context.SaveChangesAsync();
    }
}
