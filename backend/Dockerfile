# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia o arquivo da solução
COPY *.sln ./

# Copia os arquivos de projeto dos subdiretórios (excluímos os testes para evitar erros)
COPY EmpresaFornecedor.API/*.csproj EmpresaFornecedor.API/
COPY EmpresaFornecedor.Application/*.csproj EmpresaFornecedor.Application/
COPY EmpresaFornecedor.Domain/*.csproj EmpresaFornecedor.Domain/
COPY EmpresaFornecedor.Infrastructure/*.csproj EmpresaFornecedor.Infrastructure/

# Restaura os pacotes (os projetos copiados são os necessários)
RUN dotnet restore

# Copia todo o código-fonte para dentro do container
COPY . .

# Copia explicitamente as migrations
COPY EmpresaFornecedor.Infrastructure/Migrations/ EmpresaFornecedor.Infrastructure/Migrations/

# Publica o projeto de entrada (EmpresaFornecedor.API)
WORKDIR /src/EmpresaFornecedor.API
RUN dotnet publish EmpresaFornecedor.API.csproj -c Release -o /app/publish /p:GenerateDocumentationFile=true



# Etapa de runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "EmpresaFornecedor.API.dll"]
