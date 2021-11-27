const { gql } = require("apollo-server");

// schema
const typeDefs = gql`
  type Usuario {
    id: ID!
    nombre: String!
    apellido: String!
    email: String!
    creado: String!
  }

  type Query {
    obtenerCurso: String
  }

  type Mutation {
    crearUsuario: String
  }
`;

module.exports = typeDefs;
