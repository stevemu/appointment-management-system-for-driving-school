let { combineResolvers } = require( 'apollo-resolvers');

let Metro = require(  './Metro');
let Auth = require(  './Auth');

/*
  This combines our multiple resolver definition
  objects into a single definition object
*/
const resolvers = combineResolvers([
  Metro,
  Auth
]);

module.exports = resolvers;
// export default resolvers;