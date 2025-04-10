using EmpresaFornecedor.Domain.Entities;
using System;

namespace EmpresaFornecedor.Application.Validators
{
    public static class RegraParanaValidator
    {
        public static bool Validar(Empresa empresa, Fornecedor fornecedor)
        {
            return !(empresa != null &&
                     empresa.Cep.StartsWith("8") && // Simples heurística para Paraná (CEP 8xxxx-xxx)
                     fornecedor.Documento.Length == 11 &&
                     CalcularIdade(fornecedor.DataNascimento) < 18);
        }

        private static int CalcularIdade(DateOnly dataNascimento)
        {
            var hoje = DateTime.Today;
            var idade = hoje.Year - dataNascimento.Year;
            if (dataNascimento > DateOnly.FromDateTime(hoje.AddYears(-idade))) idade--;
            return idade;
        }
    }
}
