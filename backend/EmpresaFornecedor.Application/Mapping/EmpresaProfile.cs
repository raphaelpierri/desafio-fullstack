using AutoMapper;
using EmpresaFornecedor.Application.DTOs.Empresa;
using EmpresaFornecedor.Domain.Entities;

namespace EmpresaFornecedor.Application.Mappings
{
    public class EmpresaProfile : Profile
    {
        public EmpresaProfile()
        {
            CreateMap<Empresa, EmpresaDto>()
                .ForMember(dest => dest.Fornecedores, opt =>
                    opt.MapFrom(src => src.Fornecedores.Select(f => f.FornecedorId)));

            CreateMap<EmpresaCreateDto, Empresa>();

            CreateMap<EmpresaUpdateDto, Empresa>();
        }
    }
}
