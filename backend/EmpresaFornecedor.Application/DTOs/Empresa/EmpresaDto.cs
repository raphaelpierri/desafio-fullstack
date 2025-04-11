using EmpresaFornecedor.Application.DTOs.Fornecedor;

public class EmpresaDto
{
    public int Id { get; set; }
    public string Cnpj { get; set; } = null!;
    public string NomeFantasia { get; set; } = null!;
    public string Cep { get; set; } = null!;

    public List<FornecedorDto> Fornecedores { get; set; } = new();
}
