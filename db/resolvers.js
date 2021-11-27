const Usuario = require('../models/Usuario');

// resolvers
const resolvers = {
  Query: {
    obtenerCurso: () => "Curso GraphQL",
  },
  Mutation: {
    crearUsuario: async (_, { input }) => {
      const { email, password } = input;
            
      // Revisar si el usuario ya esta registrado
      const existeUsuario = await Usuario.findOne({email});
      if (existeUsuario) {
          throw new Error('El usuario ya esta registrado');
      }

      // Hashear su password
      // const salt = await bcryptjs.genSalt(10);
      // input.password = await bcryptjs.hash(password, salt);

      try {
           // Guardarlo en la base de datos
          const usuario = new Usuario(input);
          usuario.save(); // guardarlo
          return usuario;
      } catch (error) {
          console.log(error);
      }
    },
  },
};

module.exports = resolvers;
