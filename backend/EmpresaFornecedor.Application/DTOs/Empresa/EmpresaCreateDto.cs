
namespace EmpresaFornecedor.Application.DTOs.Empresa
{
    /// <summary>
    /// Modelo usado para criar uma empresa.
    /// </summary>
    public class EmpresaCreateDto
    {
        /// <summary>
        /// CNPJ da empresa (valor único).
        /// </summary>
        /// <example>12345678000199</example>
        public string Cnpj { get; set; } = null!;

        /// <summary>
        /// Nome fantasia da empresa.
        /// </summary>
        /// <example>Empresa Exemplo</example>
        public string NomeFantasia { get; set; } = null!;

        /// <summary>
        /// CEP da empresa.
        /// </summary>
        /// <example>80000000</example>
        public string Cep { get; set; } = null!;

        public List<int>? FornecedorIds { get; set; }
    }
}