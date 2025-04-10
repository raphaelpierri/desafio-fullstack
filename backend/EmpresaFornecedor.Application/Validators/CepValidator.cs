using System.Net.Http;
using System.Threading.Tasks;

namespace EmpresaFornecedor.Application.Validators
{
    public static class CepValidator
    {
        public static async Task<bool> ValidarAsync(string cep, HttpClient httpClient)
        {
            httpClient.DefaultRequestHeaders.Clear();
            httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

            try
            {
                var response = await httpClient.GetAsync($"https://viacep.com.br/ws/{cep}/json/");
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }
    }
}
