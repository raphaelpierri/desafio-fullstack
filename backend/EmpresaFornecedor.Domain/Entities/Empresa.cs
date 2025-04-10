using System.Collections.Generic;

namespace EmpresaFornecedor.Domain.Entities
{
    public class Empresa
    {
        public int Id { get; set; }
        public string Cnpj { get; set; } = null!;
        public string NomeFantasia { get; set; } = null!;
        public string Cep { get; set; } = null!;

        // Relação muitos-para-muitos com fornecedores
        public ICollection<FornecedorEmpresa> Fornecedores { get; set; } = new List<FornecedorEmpresa>();
    }
}
