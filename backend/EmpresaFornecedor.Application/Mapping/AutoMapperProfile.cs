using AutoMapper;
using EmpresaFornecedor.Application.DTOs.Empresa;
using EmpresaFornecedor.Application.DTOs.Fornecedor;
using EmpresaFornecedor.Domain.Entities;

namespace EmpresaFornecedor.Application.Mappings
{
    public class DomainToDtoProfile : Profile
    {
        public DomainToDtoProfile()
        {
            // Empresa -> EmpresaDto
            CreateMap<Empresa, EmpresaDto>()
                .ForMember(dest => dest.Fornecedores,
                    opt => opt.MapFrom(src => src.Fornecedores.Select(fe => fe.FornecedorId)));

            // Fornecedor -> FornecedorDto
            CreateMap<Fornecedor, FornecedorDto>()
                .ForMember(dest => dest.Empresas,
                    opt => opt.MapFrom(src => src.Empresas.Select(e => e.EmpresaId)));

            // DTO -> entidade (para criação)
            CreateMap<EmpresaCreateDto, Empresa>();
            CreateMap<FornecedorCreateDto, Fornecedor>();
        }
    }
}
