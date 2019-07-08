let express = require('express');
let { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
let path = require("path");

let bodyParser = require('body-parser');
let cors = require( 'cors');
let { createServer } = require( 'http');
let { execute, subscribe } = require( 'graphql');
let { SubscriptionServer } = require( 'subscriptions-transport-ws');

let { getUserId } = require( './utils');
let schema = require( './data/schema');

function run({ PORT: portFromEnv, rethinkdbConfig, APP_SECRET } = {}) {

  // configure rethinkdb
  let r = require("rethinkdbdash")({
    servers: [
      {
        host: rethinkdbConfig.host,
        port: rethinkdbConfig.port
      }
    ]
  });

  let port = portFromEnv;

  const app = express();


  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  if (process.env.NODE_ENV == "production") {
    console.log("running in production env");
    let buildPath = path.resolve(__dirname, '../client/build');
    console.log(buildPath);
    app.use('/', express.static(buildPath));
    // app.use('/', express.static('client/build'))
  } else {
    console.log("running in dev env");
    
  }

  app.use('/graphql', graphqlExpress(async (req) => {

    // if there is a token, get the user object
    let user = null;

    // console.log(req);
    // console.log('token from req:');
    // console.log(req.get('token'));
    if (req.get('token')) {
      try {

        let userId = getUserId(req.get('token'), APP_SECRET);
        user = await r.db("Metro").table("Users").get(userId);
      } catch (err) {
      } // user remains null if jwt is not valid

    }

    // console.log('here');
    return {
      schema,
      context: {
        secret: APP_SECRET,
        user,
        r
      }
    };

  }));

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
  }));

  const ws = createServer(app);

  ws.listen(port, () => {
    console.log(`API Server is now running on http://localhost:${port}/graphql`); // eslint-disable-line no-console
    console.log(
      `GraphiQL is now running on http://localhost:${port}/graphiql`
    )

    new SubscriptionServer({
      execute,
      subscribe,
      schema
    }, {
        server: ws,
        path: "/subscriptions"
      })

  });

  return ws;
}

module.exports = {
  run
}