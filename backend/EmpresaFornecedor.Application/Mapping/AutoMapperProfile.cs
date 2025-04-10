using AutoMapper;
using EmpresaFornecedor.Domain.Entities;
using EmpresaFornecedor.Application.DTOs.Fornecedor;

namespace EmpresaFornecedor.Application.Mapping;


public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<FornecedorCreateDto, Fornecedor>();
    }
}
