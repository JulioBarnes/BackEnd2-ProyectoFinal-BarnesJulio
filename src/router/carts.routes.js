import { Router } from "express";
import { productDao } from "../dao/mongoDao/products.dao.js";
import { cartDao } from "../dao/mongoDao/carts.dao.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const cart = await cartDao.getAll();

    res.json({ status: "ok", payload: cart });
  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartDao.getById(cid);
    if (!cart)
      return res.json({
        status: "error",
        message: `Cart id ${cid} not found`,
      });

    res.json({ status: "ok", payload: cart });
  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});
router.post("/", async (req, res) => {
  const body = req.body;
  try {
    const cart = await cartDao.create(body);

    res.json({ status: "ok", payload: cart });
  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const findCart = await cartDao.getById(cid);
    if (!findCart)
      return res.json({
        status: "error",
        message: `Cart id ${cid} not found`,
      });

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
  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
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
  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});
export default router;
