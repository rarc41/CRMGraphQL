const { ApolloServer } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')

const conectarDB = require('./config/db')
const jwt = require('jsonwebtoken')

// conectar a la base de datos
conectarDB();



// servidor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    // console.log(req.headers['authorization'])
    const token = req.headers['authorization'] || '';
    if(token){
      try {
        const usuario = jwt.verify(token, process.env.JWT_SECRET);
        return {
          usuario
        }
      } catch (error) {
        console.log('Hubo un error')
        console.log(error);
      }
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
