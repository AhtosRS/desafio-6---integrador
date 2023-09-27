import { cartModel } from "../models/cart.model.js";
import mongoose from "mongoose";

class CartManager {
  async newCart() {
    let cart = await cartModel.create({ products: [] });
    console.log("Carrito creado");
    return {
      status: "ok",
      message: "El Carrito se creó correctamente!",
      id: cart._id,
    };
  }

  async getCart(id) {
    if (this.validateId(id)) {
      return (await cartModel.findOne({ _id: id }).lean()) || null;
    } else {
      console.log("Carrito no encotrado");

      return null;
    }
  }

  async getCarts() {
    return await cartModel.find().lean();
  }

  async addProductToCart(cid, pid) {
    try {
      console.log(`agregando: ${pid} al carrito: ${cid}`);

      if (
        mongoose.Types.ObjectId.isValid(cid) &&
        mongoose.Types.ObjectId.isValid(pid)
      ) {
        const updateResult = await cartModel.updateOne(
          { _id: cid, "products.product": pid },
          { $inc: { "products.$.quantity": 1 } }
        );

        console.log("Update result:", updateResult);
        if (updateResult.matchedCount === 0) {
          const pushResult = await cartModel.updateOne(
            { _id: cid },
            { $push: { products: { product: pid, quantity: 1 } } }
          );

          console.log("Push result:", pushResult);
        }

        return {
          status: "ok",
          message: "El producto se agregó correctamente!",
        };
      } else {
        return {
          status: "error",
          message: "ID inválido!",
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Ocurrió un error al agregar el producto al carrito!",
      };
    }
  }

  async updateQuantityProductFromCart(cid, pid, quantity) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);
        if (!cart) {
          console.log("Carrito no encontrado");
          return false;
        }
  
        console.log('PID:', pid);
        console.log('productos del carrito:', cart.products.map(item => item.product._id ? item.product._id.toString() : item.product.toString()));
  
        const product = cart.products.find((item) => 
          (item.product._id ? item.product._id.toString() : item.product.toString()) === pid.toString()
        );
  
        if (product) {
          product.quantity = quantity;
  
          await cartModel.updateOne({ _id: cid }, { products: cart.products });
          console.log("Producto agregado");
  
          return true;
        } else {
          console.log("El producto no esta en el carrito");
          return false;
        }
      } else {
        console.log("no existe carrito con ese ID");
        return false;
      }
    } catch (error) {
      console.error("Error actualizando producto:", error);
      return false;
    }
  }

  async updateProducts(cid, products) {
    try {
        await cartModel.updateOne({_id:cid}, {products:products}, {new:true, upsert:true});
        console.log("Producto actualizado");

        return true;
    } catch (error) {
        console.log("Producto no encontrado");
        
        return false;
    }
}
  
  async deleteProductFromCart(cid, pid) {
    try {
      if (mongoose.Types.ObjectId.isValid(cid)) {
        const updateResult = await cartModel.updateOne(
          { _id: cid },
          { $pull: { products: { product: pid } } }
        );
  
        if (updateResult.matchedCount > 0) {
          console.log("Producto eliminado");
          return true;
        }
      } else {
        console.log("no existe carrito con ese ID");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteProductsFromCart(cid) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);

        await cartModel.updateOne({ _id: cid }, { products: [] });
        console.log("Producto eliminado");

        return true;
      } else {
        console.log("producto no encontrado");

        return false;
      }
    } catch (error) {
      return false;
    }
  }

  validateId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}

export default CartManager;