import fs from "fs";
import { v4 as uuid } from "uuid";

export class CartManager {
  constructor() {
    this.carts = [];
    this.path = "./src/managers/data/carts.json";
  }

  async getCart() {
    const file = await fs.promises.readFile(this.path, "utf-8");
    const fileParse = JSON.parse(file);
    this.carts = fileParse || [];
    return this.carts;
  }

  async createCart(product) {
    await this.getCart();

    const newCart = {
      id: uuid(),
      products: [],
    };
    this.carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
    return newCart;
    /*
    const productExist = this.carts.find((product) => product.code === code);
    if (productExist)
      throw new Error(`El producto con el código ${code} ingresado ya existe`);

    const propertiesValues = Object.values(newProduct);

    if (propertiesValues.includes(undefined))
      throw new Error("Todos los campos del producto son obligatorios!");

    this.carts.push(newProduct);

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
*/
  }

  async getCartById(cid) {
    await this.getCart();
    const getCartId = this.carts.find((cart) => cart.id === cid);
    if (!getCartId) throw new Error(`Carrito con id ${id} no encontrado`);
    return getCartId;
  }

  async addProductToCart(cid, pid) {
    const cart = await this.getCartById(cid);

    const product = cart.products.find(
      (productCart) => productCart.product === pid
    );
    if (!product) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      product.quantity++;
    }

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts));

    return cart;
  }

  async deleteProduct(id) {
    await this.getProductById(id);
    this.carts = this.carts.filter((product) => product.id !== id);

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts));

    return `El producto con el id ${id} fue eliminado`;
  }
}
