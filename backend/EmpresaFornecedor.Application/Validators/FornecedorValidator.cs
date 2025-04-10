using FluentValidation;
using EmpresaFornecedor.Application.DTOs.Fornecedor;

public class FornecedorCreateDtoValidator : AbstractValidator<FornecedorCreateDto>
{
    public FornecedorCreateDtoValidator()
    {
        RuleFor(x => x.Documento).NotEmpty().Length(11, 14);
        RuleFor(x => x.Nome).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Cep).NotEmpty().Length(8);
    }
}
