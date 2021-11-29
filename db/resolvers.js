const Usuario = require("../models/Usuario");
const Producto = require("../models/Producto");
const Cliente = require("../models/Cliente");
const Pedido = require("../models/Pedido");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

const crearToken = (usuario, secret, expiresIn) => {
  // console.log(usuario);
  const { id, email, nombre, apellido } = usuario;
  return jwt.sign({ id, email, nombre, apellido }, secret, { expiresIn });
};

// resolvers
const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuarioId = await jwt.verify(token, process.env.JWT_SECRET);
      return usuarioId;
    },

    obtenerProductos: async () => {
      try {
        const productos = await Producto.find({});
        return productos;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerProducto: async (_, { id }) => {
      // revisar si el producto existe
      const producto = await Producto.findById(id);
      if (!producto) {
        throw new Error("Producto no encontrado");
      }
      return producto;
    },
    obtenerClientes: async () => {
      try {
        const clientes = await Cliente.find({});
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerClientesVendedor: async (_, {}, ctx) => {

      try {
        const clientes = await Cliente.find({ vendedor: ctx.usuario.id });
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },

    obtenerCliente: async (_, { id }, ctx) => {
      // revisar si el cliente existe
      const cliente = await Cliente.findById(id);
      if (!cliente) {
        throw new Error("Cliente no encontrado");
      }

      // solo quien lo creo puede verlo
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes permisos para ver este cliente");
      }

      return cliente;
    }
  },

  Mutation: {
    crearUsuario: async (_, { input }) => {
      const { email, password } = input;

      // Revisar si el usuario ya esta registrado
      const existeUsuario = await Usuario.findOne({ email });
      if (existeUsuario) {
        throw new Error("El usuario ya esta registrado");
      }

      // Hashear su password
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      try {
        // Guardarlo en la base de datos
        const usuario = new Usuario(input);
        usuario.save(); // guardarlo
        return usuario;
      } catch (error) {
        console.log(error);
      }
    },

    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;
      // Revisar si el usuario existe
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error("El usuario no existe");
      }

      // Revisar si el password es correcto
      const passwordCorrecto = await bcryptjs.compare(
        password,
        existeUsuario.password
      );
      if (!passwordCorrecto) {
        throw new Error("El password es incorrecto");
      }

      // Crear y firmar el JWT
      return {
        token: crearToken(existeUsuario, process.env.JWT_SECRET, "24h"),
      };
    },

    // Productos
    crearProducto: async (_, { input }) => {
      try {
        const producto = new Producto(input);
        const resultado = await producto.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarProducto: async (_, { id, input }) => {
      // Revisar si el producto existe
      let producto = await Producto.findById(id);
      if (!producto) {
        throw new Error("Producto no encontrado");
      }
      try {
        const productoUpdated = await Producto.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        });
        return productoUpdated;
      } catch (error) {
        console.log(error);
      }
    },

    eliminarProducto: async (_, { id }) => {
      // Revisar si el producto existe
      let producto = await Producto.findById(id);
      if (!producto) {
        throw new Error('producto no encontrado');
      }

      await Producto.findOneAndDelete({ _id: id });
      return "Producto Eliminado";
    },

    // Clientes
    nuevoCliente: async (_, { input }, ctx) => {
      // revisar si el cliente ya esta registrado
      console.log(ctx);
      const { email } = input;
      const existeCliente = await Cliente.findOne({ email });
      if (existeCliente) {
        throw new Error("El cliente ya esta registrado");
      }
      const nuevoCliente = new Cliente(input);


      // asignar al vendedor
      nuevoCliente.vendedor = ctx.usuario.id;

      // guardarlo en la base de datos
      try {
        const resultado = await nuevoCliente.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarCliente: async (_, { id, input }, ctx) => {
      // revisar si el cliente existe
      let cliente = await Cliente.findById(id);
      if (!cliente) {
        throw new Error("Cliente no encontrado");
      }

      // solo un vendedor puede actualizar un cliente
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes permisos para actualizar este cliente");
      }

      // actualizar el cliente
      try {
        const clienteActualizado = await Cliente.findByIdAndUpdate(
          id,
          input,
          {
            new: true,
            runValidators: true,
          }
        );
        return clienteActualizado;
      } catch (error) {
        console.log(error);
      }
    },
    
    eliminarCliente: async (_, { id }, ctx) => {
      // revisar si el cliente existe
      let cliente = await Cliente.findById(id);
      if (!cliente) {
        throw new Error("Cliente no encontrado");
      }

      // solo un vendedor puede eliminar un cliente
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes permisos para eliminar este cliente");
      }

      await Cliente.findOneAndDelete({ _id: id });
      return "Cliente Eliminado";
    },
    nuevoPedido: async (_, { input }, ctx) => {
      // revisar si el cliente existe
      const { cliente } = input;
      let clienteExiste = await Cliente.findById(cliente);
      if (!clienteExiste) {
        throw new Error("Cliente no encontrado");
      }

      // revisar si el cliente pertence al vendedor autenticado
      if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes permisos para crear un pedido a este cliente");
      }

      // revisar si el stock es suficiente
      // const { pedido } = input;
      // const productosValidados = pedido.map(async (producto) => {
      //   const productoExiste = await Producto.findById(producto.id);
      //   if (!productoExiste) {
      //     throw new Error("Producto no encontrado");
      //   }
      //   if (productoExiste.existencia < producto.cantidad) {
      //     throw new Error("No hay suficiente stock");
      //   }
      //   return producto;
      // });

      // // crear el pedido
      // const nuevoPedido = new Pedido(input);

      // // guardarlo en la base de datos
      // try {
      //   const resultado = await nuevoPedido.save();
      //   return resultado;
      // } catch (error) {
      //   console.log(error);
      // }
    }
  },
};

module.exports = resolvers;
