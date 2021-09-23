// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth0Domain: 'dev-iubhvavp.us.auth0.com',
  auth0ClientId: 'wanWJnwVUzARKvRHiF7sTcweYBapWgth',

  // LOCAL - SERVERLESS OFFLINE VARIABLES
  // apiUrl: 'http://localhost:15001/dev',
  // websocketUrl: 'ws://localhost:3001',
  // END LOCAL - SERVERLESS OFFLINE VARIABLES

  // ****** CHANGE HERE ****** AWS - SERVERLESS VARIABLES
  apiUrl: 'https://ff1p9desc7.execute-api.us-east-1.amazonaws.com/dev',
  websocketUrl: 'wss://50s7cthnz4.execute-api.us-east-1.amazonaws.com/dev',
  // END AWS - SERVERLESS VARIABLES
};
