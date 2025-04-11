FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY *.sln ./

COPY EmpresaFornecedor.API/*.csproj EmpresaFornecedor.API/
COPY EmpresaFornecedor.Application/*.csproj EmpresaFornecedor.Application/
COPY EmpresaFornecedor.Domain/*.csproj EmpresaFornecedor.Domain/
COPY EmpresaFornecedor.Infrastructure/*.csproj EmpresaFornecedor.Infrastructure/

RUN dotnet restore

COPY . .

COPY EmpresaFornecedor.Infrastructure/Migrations/ EmpresaFornecedor.Infrastructure/Migrations/

WORKDIR /src/EmpresaFornecedor.API
RUN dotnet publish EmpresaFornecedor.API.csproj -c Release -o /app/publish /p:GenerateDocumentationFile=true



FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "EmpresaFornecedor.API.dll"]
