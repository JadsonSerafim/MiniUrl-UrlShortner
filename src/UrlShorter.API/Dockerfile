FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine
RUN apk add --no-cache curl
USER $APP_UID
WORKDIR /app
COPY publish-api/ .
EXPOSE 8080
ENTRYPOINT ["dotnet", "UrlShorter.API.dll"]
