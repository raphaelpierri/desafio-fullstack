namespace EmpresaFornecedor.Application.DTOs.Empresa
{
    public class EmpresaCreateDto
    {
        public string Cnpj { get; set; } = null!;
        public string NomeFantasia { get; set; } = null!;
        public string Cep { get; set; } = null!;
    }
}
