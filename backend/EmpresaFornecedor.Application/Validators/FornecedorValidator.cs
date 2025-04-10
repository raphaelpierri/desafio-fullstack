using EmpresaFornecedor.Application.DTOs.Fornecedor;
using EmpresaFornecedor.Domain.Entities;

namespace EmpresaFornecedor.Application.Validators
{
    public static class FornecedorValidator
    {
        public static bool EmpresaParanaComFornecedorMenorDeIdade(Empresa empresa, FornecedorCreateDto fornecedor)
        {
            if (!string.IsNullOrWhiteSpace(empresa?.Cep) &&
                empresa.Cep.StartsWith("8") && // Assumindo que CEPs do PR começam com 8
                fornecedor.DataNascimento.HasValue)
            {
                var idade = CalcularIdade(fornecedor.DataNascimento.Value);
                return idade < 18;
            }

            return false;
        }

        private static int CalcularIdade(DateOnly nascimento)
        {
            var hoje = DateOnly.FromDateTime(DateTime.Today);
            var idade = hoje.Year - nascimento.Year;

            if (nascimento > hoje.AddYears(-idade))
                idade--;

            return idade;
        }
    }
}
