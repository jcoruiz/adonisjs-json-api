FROM node:lts-jessie
# 2. Set the working directory inside the container to /app
WORKDIR /app

RUN npm i -g @adonisjs/cli
# 3. Add the .env to the directory (We need those variables)
ADD .env /app
# 4. Expose port defined in .env file
EXPOSE ${PORT}
# 5. Add package.json to the directory
ADD package.json /app
# 6. Copy the rest into directory
COPY . /app
# 7. Install dependencies
CMD ["npm", "install"]
# 8. Start the app inside the container
#CMD ["adonis", "serve", "--dev", "--polling"]
