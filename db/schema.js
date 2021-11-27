const { gql } = require("apollo-server");

// schema
const typeDefs = gql`
  type Curso {
    titulo: String
    tecnologia: String
  }
  type Tecnologia {
    tecnologia: String
  }
  input CursoInput {
    tecnologia: String
  }
  type Query {
    obtenerCursos(input: CursoInput!): [Curso]
    obtenerTecnologias: [Tecnologia]
  }
`;

module.exports = typeDefs;
