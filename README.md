# React Map Add Bears

https://github.com/leighhalliday/google-maps-react-2020
https://www.youtube.com/watch?v=WZcxJGmLbSo


Create the app `npx create-react-app react-map-add-bears`

## Install dependencies

```bash
# https://www.npmjs.com/package/@react-google-maps/api
npm i -S @react-google-maps/api

# https://www.npmjs.com/package/use-places-autocomplete
npm install --save use-places-autocomplete

# https://reach.tech/combobox/
npm install @reach/combobox

# https://date-fns.org/
npm install --save date-fns
```

- Create environment variable for the map
- As long as it starts with REACT_APP_ the create-react-app will pick it up
- These can be called in your code using `process.env.REACT_APP_GOOGLE_MAP_API_KEY`

```javascript
REACT_APP_GOOGLE_MAP_API_KEY=""
HTTPS=true // Needed so that the browser can ask the user for their location
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

## Run the project

`npm run start`
Navigate to **HTTPS** localhost:3000


# Version 2 

Posting Data to Server from React - Query Updates from Mutations

## Install dependencies

- React Query

https://react-query.tanstack.com/
Fetch, cache and update data in your React and React Native applications all without touching any "global state".

`npm i react-query`
`npm install react-router-dom`


# Set up backend

Babel with express
https://medium.com/@agavitalis/setting-up-a-nodejs-express-application-with-babel-642fe0dd45a5

https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/

- express in https

Create self signed cert
```bash
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

Enable HTTPS in Express
```javascript
import fs from 'fs';
import https from 'https';
import http from 'http';

const credentials = {key: fs.readFileSync('server.key'), cert: fs.readFileSync('server.cert')};
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(8080, () => console.log(`listening on port 8080 for http`));
httpsServer.listen(8443, () => console.log(`listening on port 8443 for https`));
```

Open browser and go to endpoint, make sure to accept warning due to self signing

## See query page for Cache details

src/query.js

This is able to update the UI with the new information before it's stored in the database, that way the user get's instant feedback.