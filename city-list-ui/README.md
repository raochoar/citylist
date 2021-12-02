# City-list-ui Single Page application

This project renders a list of cities, with an infinte scroll.
Also allows to the user to select a city and send that state to a backend service.


## Non-functional features
This app has some resilence feature to re-try the request if the server fails. You can see that configuration values in the configs.js class.

Also, if the backend is not responding the app has a simple error handler that notify to the user the situation and reloads the app after a period of time.

The last feature is debounced search; this allows to the input bar to wait 1 second in order to start to filter the list; making more responsive the user experience.
In addition, the app has the intelligence to cancel the request if the user is fast enough to send 2 filter request at same time (corner case when you change the filter very  quickly and/or the backend service is very slow to respond).

For the notification alerts there is a generic component on uiCore folder, that use a reducer and a content provider to render notification alerts from any other component that are inside the notification alert. 

## Software stack (dependencies)
* react-bootstrap: library to manage layout and render responsive components.
* lodash.debounce: loadash implementation of debounce (to debounce onChange event on input text component)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

**Current coverage value is 77.43%** 

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

