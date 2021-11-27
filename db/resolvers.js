
// resolvers
const resolvers = {
  Query: {
    obtenerCurso: () => 'Curso GraphQL'
  },
  Mutation: {
    crearUsuario: (_,{input}) => {
      console.log(input);
      return 'Usuario creado';
    }
  }
};

module.exports = resolvers;
