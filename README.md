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



