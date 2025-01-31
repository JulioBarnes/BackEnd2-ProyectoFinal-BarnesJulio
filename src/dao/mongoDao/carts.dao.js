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
}

export const cartDao = new CartDao();
