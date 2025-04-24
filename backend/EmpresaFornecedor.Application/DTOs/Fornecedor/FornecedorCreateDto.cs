namespace EmpresaFornecedor.Application.DTOs.Fornecedor
{
    public class FornecedorCreateDto
    {
        public string Documento { get; set; } = null!;
        public string Nome { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Cep { get; set; } = null!;
        public string? Rg { get; set; } = null!;
        public DateOnly? DataNascimento { get; set; }
        public List<int>? Empresas { get; set; }
    }
}
