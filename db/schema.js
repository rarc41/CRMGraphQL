const { gql } = require("apollo-server");

// schema
const typeDefs = gql`
  type Query {
    obtenerCurso: String
  }
`;

module.exports = typeDefs;
