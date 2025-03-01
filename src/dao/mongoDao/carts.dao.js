import { cartModel } from "../models/cart.model.js";

class CartDao {
  async getAll() {
    return await cartModel.find();
  }

  async getById(id) {
    return await cartModel.findById(id).populate("products.product");
  }

  async create(data) {
    return await cartModel.create(data);
  }

  async update(id, data) {
    return await cartModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteProductsInCart(cid, pid) {
    return await cartModel.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } }, // Uso de $pull para eliminar el producto por id
      { new: true }
    );
  }

  async getOrderNumber() {
    return Number(Date.now() + Math.floor(Math.random() * 10000 + 1));
  }

  // Método para generar un ticket
  async finalizePurchase(cartId, totalPrice) {
    // Generar el ticket
    const orderNumber = await this.getOrderNumber();
    const ticket = {
      orderNumber,
      date: new Date(), // Fecha actual
    };

    // Actualizar el carrito con el ticket, el totalPrice y cambiar el estado a "completed"
    const purchasedCart = await cartModel.findByIdAndUpdate(
      cartId,
      { $set: { ticket, totalPrice, status: "completed" } },
      { new: true }
    );

    return purchasedCart;
  }
}

export const cartDao = new CartDao();
