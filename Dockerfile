FROM node:16-alpine
LABEL maintainer="support@mist.io"

WORKDIR /portal
COPY ./ ./
COPY ./container/nginx.conf /etc/nginx/nginx.conf
COPY ./container/entry.sh /entry.sh
RUN apk add --update --no-cache git nginx && npm update && npm install -g -U --no-optional @web/dev-server rollup --unsafe-perm

RUN npm install && npm run build && cp package.json /

EXPOSE 80 8000

ENTRYPOINT [ "/entry.sh" ]
