namespace EmpresaFornecedor.Application.DTOs.Fornecedor
{
    public class FornecedorUpdateDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Cep { get; set; } = null!;
        public string Rg { get; set; } = null!;
        public DateOnly? DataNascimento { get; set; }
    }
}
