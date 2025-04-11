FROM mcr.microsoft.com/dotnet/aspnet:9.0-nanoserver-1809 AS base
WORKDIR /app
EXPOSE 5000

ENV ASPNETCORE_URLS=http://+:5000

FROM mcr.microsoft.com/dotnet/sdk:9.0-nanoserver-1809 AS build
ARG configuration=Release
WORKDIR /src
COPY ["backend/EmpresaFornecedor.API/EmpresaFornecedor.API.csproj", "backend/EmpresaFornecedor.API/"]
RUN dotnet restore "backend\EmpresaFornecedor.API\EmpresaFornecedor.API.csproj"
COPY . .
WORKDIR "/src/backend/EmpresaFornecedor.API"
RUN dotnet build "EmpresaFornecedor.API.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "EmpresaFornecedor.API.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "EmpresaFornecedor.API.dll"]
