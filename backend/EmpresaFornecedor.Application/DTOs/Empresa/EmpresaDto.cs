using EmpresaFornecedor.Application.DTOs.Fornecedor;

namespace EmpresaFornecedor.Application.DTOs.Empresa
{
    public class EmpresaDto
    {
        public int Id { get; set; }
        public string Cnpj { get; set; } = null!;
        public string NomeFantasia { get; set; } = null!;
        public string Cep { get; set; } = null!;
        public List<FornecedorResumoDto> Fornecedores { get; set; } = new();
    }
}