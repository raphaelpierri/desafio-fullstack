using AutoMapper;
using EmpresaFornecedor.Domain.Entities;
using EmpresaFornecedor.Application.DTOs.Fornecedor;
using EmpresaFornecedor.Application.DTOs.Empresa;

namespace EmpresaFornecedor.Application.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Fornecedor
            CreateMap<Fornecedor, FornecedorDto>();
            CreateMap<FornecedorCreateDto, Fornecedor>();
            CreateMap<FornecedorUpdateDto, Fornecedor>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            // Empresa
            CreateMap<Empresa, EmpresaDto>();
            CreateMap<EmpresaCreateDto, Empresa>();
            CreateMap<EmpresaUpdateDto, Empresa>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
        }
    }
}
