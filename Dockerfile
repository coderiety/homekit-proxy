FROM node:11.15.0-alpine

CMD ["bin/run"]

RUN apk add --no-cache \
      coreutils \
      curl \
      eudev-dev \
      g++ \
      git \
      linux-headers \
      make \
      python \
      && \
    mkdir -p /usr/local/src/open-zwave && \
    curl -fLsS \
      https://api.github.com/repos/OpenZWave/open-zwave/tarball/75bcd082e478fc08bff872e62fc8122bae14eb86 | \
      tar xz -C /usr/local/src/open-zwave --strip-components 1 && \
    cd /usr/local/src/open-zwave && \
    make && \
    make install

WORKDIR /code

COPY package-lock.json package.json ./
RUN npm install
