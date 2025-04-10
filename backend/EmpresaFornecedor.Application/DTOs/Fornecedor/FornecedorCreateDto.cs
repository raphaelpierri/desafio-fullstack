namespace EmpresaFornecedor.Application.DTOs.Fornecedor
{
    /// <summary>
    /// Modelo usado para criar um fornecedor.
    /// </summary>
    public class FornecedorCreateDto
    {
        /// <summary>
        /// Documento do fornecedor (CPF ou CNPJ, valor único).
        /// </summary>
        /// <example>12345678901</example>
        public string Documento { get; set; } = null!;

        /// <summary>
        /// Nome do fornecedor.
        /// </summary>
        /// <example>João da Silva</example>
        public string Nome { get; set; } = null!;

        /// <summary>
        /// E-mail do fornecedor.
        /// </summary>
        /// <example>joao.silva@example.com</example>
        public string Email { get; set; } = null!;

        /// <summary>
        /// CEP do fornecedor.
        /// </summary>
        /// <example>80000000</example>
        public string Cep { get; set; } = null!;

        /// <summary>
        /// RG do fornecedor (necessário para pessoa física).
        /// </summary>
        /// <example>123456789</example>
        public string? Rg { get; set; }

        /// <summary>
        /// Data de nascimento do fornecedor (necessário para pessoa física).
        /// </summary>
        /// <example>2000-01-01</example>
        public DateOnly? DataNascimento { get; set; }

        public List<int>? Empresas { get; set; }
    }
}
