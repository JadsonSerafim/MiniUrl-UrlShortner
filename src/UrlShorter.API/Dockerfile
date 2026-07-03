FROM mcr.microsoft.com/dotnet/aspnet:10.0
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
USER $APP_UID
WORKDIR /app
COPY publish-api/ .
EXPOSE 8080
ENTRYPOINT ["dotnet", "UrlShorter.API.dll"]
