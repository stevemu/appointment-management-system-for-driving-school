// for production use
let fallback = require("express-history-api-fallback");

let express =  require('express');
const app = express();
app.set("port", 4005);

const root = `${__dirname}/build`;
app.use(express.static(root));
app.use(fallback('index.html', { root }));

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});