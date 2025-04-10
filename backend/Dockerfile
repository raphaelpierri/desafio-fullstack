FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .

# Instalar dependências e compilar a aplicação
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Expõe apenas a porta HTTP
EXPOSE 80

# Definindo o ponto de entrada da aplicação
ENTRYPOINT ["dotnet", "EmpresaFornecedor.API.dll"]
