FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy csproj and restore
COPY ["src/UrlShorter.API/UrlShorter.API.csproj", "src/UrlShorter.API/"]
COPY ["src/UrlShorter.Application/UrlShorter.Application.csproj", "src/UrlShorter.Application/"]
COPY ["src/UrlShorter.Domain/UrlShorter.Domain.csproj", "src/UrlShorter.Domain/"]
COPY ["src/UrlShorter.Infrastructure/UrlShorter.Infrastructure.csproj", "src/UrlShorter.Infrastructure/"]
RUN dotnet restore "src/UrlShorter.API/UrlShorter.API.csproj"

# Copy everything and build
COPY . .
RUN dotnet publish "src/UrlShorter.API/UrlShorter.API.csproj" -c Release -o /out

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine
RUN apk add --no-cache curl
USER $APP_UID
WORKDIR /app
COPY --from=build /out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "UrlShorter.API.dll"]
