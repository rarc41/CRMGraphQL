const { ApolloServer } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')



// servidor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => { 
    const miContext = "Hola"
    return {
      miContext
    }
  },
  // el siguiente plugin es para cambiar el landing page a graphql playground
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      // options
    }),
  ],
});

// arrancar el servidor
server.listen().then(({ url }) => {
  console.log(`servidor corriendo en ${url}`);
});
