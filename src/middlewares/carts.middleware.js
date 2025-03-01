import { cartDao } from "../dao/mongoDao/carts.dao.js";
import { productDao } from "../dao/mongoDao/products.dao.js";

class CartController {
  async getAll(req, res) {
    try {
      const cart = await cartDao.getAll();

      res.json({ status: "ok", payload: cart });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        details: error,
      });
    }
  }

  async getById(req, res) {
    const { cid } = req.params;
    try {
      const cart = await cartDao.getById(cid);
      if (!cart)
        return res.json({
          status: "error",
          message: `Cart id ${cid} not found`,
        });

      res.json({ status: "ok", payload: cart });
    } catch (error) {
      console.error(error);
      res.send(error.message);
    }
  }

  async create(req, res) {
    const body = req.body;
    try {
      const cart = await cartDao.create(body);

      res.json({ status: "ok", payload: cart });
    } catch (error) {
      console.error(error);
      res.send(error.message);
    }
  }

  async update(req, res) {
    const { cid, pid } = req.params;
    try {
      const findCart = await cartDao.getById(cid);
      if (!findCart) {
        return res.json({
          status: "error",
          message: `Cart id ${cid} not found`,
        });
      }
      if (findCart.status !== "pending") {
        return res.status(400).json({
          error: `The cart has already been ${findCart.status}`,
        });
      }

      const product = findCart.products.find((productCart) =>
        productCart.product.equals(pid)
      );
      if (!product) {
        findCart.products.push({ product: pid, quantity: 1 });
      } else {
        product.quantity++;
      }

      const cart = await cartDao.update(
        cid,
        { products: findCart.products },
        { new: true }
      );

      res.json({ status: "ok", payload: cart });
    } catch (error) {
      console.error(error);
      res.send(error.message);
    }
  }

  async delete(req, res) {
    const { cid, pid } = req.params;
    try {
      const product = await productDao.getById(pid);
      if (!product)
        return res.json({
          status: "error",
          message: `Product id ${pid} not found`,
        });

      const cart = await cartDao.getById(cid);
      if (!cart)
        return res.json({
          status: "error",
          message: `Cart id ${cid} not found`,
        });

      const clearCart = await cartDao.deleteProductsInCart(cid, pid);

      res.status(200).json({
        status: "success",
        message: `Product id ${pid} removed from cart id ${cid}`,
        payload: clearCart,
      });
    } catch (error) {
      console.error(error);
      res.send(error.message);
    }
  }

  async purchase(req, res) {
    try {
      const { cid } = req.params;
      const user = req.user; // Usuario obtenido de la estrategia "current"

      const cart = await cartDao.getById(cid);

      if (!cart) {
        return res.status(404).json({
          error: "Cart not found",
        });
      }

      if (cart.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({
          message: "Access denied. This cart does not belong to you.",
        });
      }

      if (cart.status !== "pending") {
        return res.status(400).json({
          error: `The cart has already been ${cart.status}`,
        });
      }

      // Validar el stock de cada producto en el carrito
      const productsWithoutStock = [];
      let totalPrice = 0; // Variable para acumular el precio total
      for (const item of cart.products) {
        const product = await productDao.getById(item.product._id);

        if (!product) {
          return res
            .status(404)
            .json({ error: `Product ${item.product._id} not found` });
        }

        if (product.stock < item.quantity) {
          productsWithoutStock.push({
            productId: item.product._id,
            productName: product.title,
            availableStock: product.stock,
            requestedQuantity: item.quantity,
          });
        } else {
          // Calcular el costo de cada producto y sumarlo al total
          totalPrice += product.price * item.quantity;
        }
      }

      // Si hay productos sin stock, lanzar un error
      if (productsWithoutStock.length > 0) {
        return res.status(400).json({
          error: "Not enough stock for some products",
          productsWithoutStock,
        });
      }

      // Actualizar el stock de los productos
      for (const item of cart.products) {
        const product = await productDao.getById(item.product._id);
        product.stock -= item.quantity; // Reducir el stock
        await productDao.update(product._id, { stock: product.stock }); // Guardar el cambio
      }

      const purchasedCart = await cartDao.finalizePurchase(cid, totalPrice);

      res.status(200).json(purchasedCart);
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        details: error,
      });
    }
  }
}

export const cartController = new CartController();
