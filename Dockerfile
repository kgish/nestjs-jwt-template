FROM node:12-alpine

EXPOSE 3000 9229

#RUN addgroup -S nestjs && adduser -S nestjs -G nestjs

#USER nestjs

COPY . /home/nestjs

WORKDIR /home/nestjs

RUN npm install && chmod a+x ./scripts/*.sh

CMD [ "./scripts/start.sh" ]
