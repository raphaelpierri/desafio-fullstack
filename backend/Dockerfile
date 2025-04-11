# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY *.sln .
COPY EmpresaFornecedor.API/*.csproj EmpresaFornecedor.API/
COPY EmpresaFornecedor.Application/*.csproj EmpresaFornecedor.Application/
COPY EmpresaFornecedor.Domain/*.csproj EmpresaFornecedor.Domain/
COPY EmpresaFornecedor.Infrastructure/*.csproj EmpresaFornecedor.Infrastructure/

RUN dotnet restore

COPY . .

WORKDIR /src/EmpresaFornecedor.API
RUN dotnet publish -c Release -o /app/publish /p:GenerateDocumentationFile=true

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 80

ENTRYPOINT ["dotnet", "EmpresaFornecedor.API.dll"]
