using AutoMapper;
using EmpresaFornecedor.Application.DTOs.Fornecedor;
using EmpresaFornecedor.Domain.Entities;

namespace EmpresaFornecedor.Application.Mappings
{
    public class FornecedorProfile : Profile
    {
        public FornecedorProfile()
        {
            CreateMap<Fornecedor, FornecedorDto>()
                .ForMember(dest => dest.Empresas, opt =>
                    opt.MapFrom(src => src.Empresas.Select(e => e.EmpresaId)));

            CreateMap<FornecedorCreateDto, Fornecedor>();

            CreateMap<FornecedorUpdateDto, Fornecedor>();
        }
    }
}
