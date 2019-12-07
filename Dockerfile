FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-server
WORKDIR /app

ARG MYGET_API_KEY
ARG BUILD_CONFIG="Release"
ARG ASPNETCORE_ENVIRONMENT="Production"
ENV ASPNETCORE_ENVIRONMENT=${ASPNETCORE_ENVIRONMENT}

COPY *.sln ./
COPY ./src/Ranger.Spa ./src/Ranger.Spa
COPY ./scripts ./scripts
COPY ./test ./test

RUN ./scripts/create-nuget-config.sh ${MYGET_API_KEY}
RUN dotnet publish -c ${BUILD_CONFIG} -o /app/published

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-spa
WORKDIR /app
COPY --from=build-server /app/published ./published

ARG NODE_ENV="production"
ENV NODE_ENV = ${NODE_ENV}
ENV NODE_VERSION 10.15.3
ENV NODE_DOWNLOAD_SHA 6c35b85a7cd4188ab7578354277b2b2ca43eacc864a2a16b3669753ec2369d52
RUN curl -SL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" --output nodejs.tar.gz \
    && echo "$NODE_DOWNLOAD_SHA nodejs.tar.gz" | sha256sum -c - \
    && tar -xzf "nodejs.tar.gz" -C /usr/local --strip-components=1 \
    && rm nodejs.tar.gz \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs

COPY package*.json ./
RUN npm install && \
    npm install webpack webpack-cli -g 

COPY ./src/react ./src/react

ARG WEBPACK_ENV="prod"

RUN webpack --config ./src/react/webpack.${WEBPACK_ENV}.js && \
    npm run copy-oidc-client

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
COPY --from=build-spa /app/published .

ARG ASPNETCORE_ENVIRONMENT="Production"
ENV ASPNETCORE_ENVIRONMENT=${ASPNETCORE_ENVIRONMENT}

ARG NODE_ENV="production"
ENV NODE_ENV = ${NODE_ENV}

EXPOSE 8080
ENTRYPOINT ["dotnet", "Ranger.Spa.dll"]