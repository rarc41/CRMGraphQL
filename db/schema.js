const { gql } = require("apollo-server");

// schema
const typeDefs = gql`
  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }

  type Token {
    token: String
  }

  type Producto {
    id: ID
    nombre: String
    existencia: Int
    precio: Float
    creado: String
  }

  type Cliente {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
    telefono: String
    empresa: String
    vendedor: ID
  }

  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  input ProductoInput {
    nombre: String
    existencia: Int
    precio: Float
  }

  input ClienteInput {
    nombre: String!
    apellido: String!
    email: String!
    telefono: String
    empresa: String!
  }

  input AutenticarInput {
    email: String!
    password: String!
  }

  type Query {
    obtenerUsuario(token: String!): Usuario
    obtenerProductos: [Producto]
    obtenerProducto(id: ID!): Producto
  }

  type Mutation {
    crearUsuario(input: UsuarioInput): Usuario
    autenticarUsuario(input: AutenticarInput): Token

    #Productos
    crearProducto(input: ProductoInput): Producto
    actualizarProducto(id: ID!, input: ProductoInput): Producto
    eliminarProducto(id: ID!): String

    #Clientes
    nuevoCliente(input: ClienteInput): Cliente
  }
`;

module.exports = typeDefs;
