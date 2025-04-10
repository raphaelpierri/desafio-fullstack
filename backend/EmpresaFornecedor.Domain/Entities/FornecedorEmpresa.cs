namespace EmpresaFornecedor.Domain.Entities
{
    public class FornecedorEmpresa
    {
        public int EmpresaId { get; set; }
        public int FornecedorId { get; set; }

        public Empresa Empresa { get; set; } = null!;
        public Fornecedor Fornecedor { get; set; } = null!;
    }
}
