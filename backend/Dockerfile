# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia os arquivos de projeto
COPY *.sln .
COPY EmpresaFornecedor.API/*.csproj EmpresaFornecedor.API/
COPY EmpresaFornecedor.Application/*.csproj EmpresaFornecedor.Application/
COPY EmpresaFornecedor.Domain/*.csproj EmpresaFornecedor.Domain/
COPY EmpresaFornecedor.Infrastructure/*.csproj EmpresaFornecedor.Infrastructure/

# Restaura os pacotes
RUN dotnet restore

# Copia todo o conteúdo
COPY . .

# Publica a aplicação
WORKDIR /src/EmpresaFornecedor.API
RUN dotnet publish -c Release -o /app/publish /p:GenerateDocumentationFile=true

# Etapa final (runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copia apenas os arquivos publicados
COPY --from=build /app/publish .

# Expõe a porta da API
EXPOSE 80

# Comando para rodar a API
ENTRYPOINT ["dotnet", "EmpresaFornecedor.API.dll"]
