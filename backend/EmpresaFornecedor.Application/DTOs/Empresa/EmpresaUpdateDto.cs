namespace EmpresaFornecedor.Application.DTOs.Empresa
{
    public class EmpresaUpdateDto
    {
        public int Id { get; set; }
        public string NomeFantasia { get; set; } = null!;
        public string Cep { get; set; } = null!;

        public List<int>? FornecedorIds { get; set; }
    }
}
