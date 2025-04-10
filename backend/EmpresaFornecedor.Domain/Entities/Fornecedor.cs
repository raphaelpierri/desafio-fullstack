namespace EmpresaFornecedor.Domain.Entities
{
    public class Fornecedor
    {
        public int Id { get; set; }
        public string Documento { get; set; } = null!;
        public string Nome { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Cep { get; set; } = null!;
        public string Rg { get; set; } = null!;
        public DateOnly DataNascimento { get; set; }

        public ICollection<FornecedorEmpresa> Empresas { get; set; } = new List<FornecedorEmpresa>();
    }
}
