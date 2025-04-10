using EmpresaFornecedor.Application.DTOs.Empresa;

namespace EmpresaFornecedor.Application.DTOs.Fornecedor
{
    public class FornecedorDto
    {
        public int Id { get; set; }
        public string Documento { get; set; } = null!;
        public string Nome { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Cep { get; set; } = null!;
        public string Rg { get; set; } = null!;
        public DateOnly? DataNascimento { get; set; }
        public List<int>? EmpresaIds { get; set; }
    }
}
