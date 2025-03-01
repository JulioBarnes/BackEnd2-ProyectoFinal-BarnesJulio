import { productDao } from "../dao/mongoDao/products.dao.js";

class ProductController {
  async getAll(req, res) {
    const { limit, page, sort, category, status } = req.query;
    try {
      const options = {
        limit: limit || 10,
        page: page || 1,
        sort: {
          price: sort === "asc" ? 1 : -1,
        },
        lean: true,
        category,
      };

      if (status) {
        const products = await productDao.getAll({ status: status }, options);
        return res.json({ status: "ok", payload: products });
      }

      if (category) {
        const products = await productDao.getAll(
          { category: category },
          options
        );
        return res.json({ status: "ok", payload: products });
      }

      const products = await productDao.getAll({}, options);

      res.json({ status: "ok", payload: products });
    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  }

  async getById(req, res) {
    const { pid } = req.params;
    try {
      const product = await productDao.getById(pid);
      if (!product)
        return res.json({
          status: "error",
          message: `Product id ${pid} not found`,
        });

      res.json({ status: "ok", payload: product });
    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  }

  async create(req, res) {
    const body = req.body;
    try {
      const product = await productDao.create(body);

      res.json({ status: "ok", payload: product });
    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  }

  async update(req, res) {
    const { pid } = req.params;
    const body = req.body;
    try {
      const findProduct = await productDao.getById(pid);
      if (!findProduct)
        return res.json({
          status: "error",
          message: `Product id ${pid} not found`,
        });

      const product = await productDao.update(pid, body, {
        new: true,
      });
      res.json({ status: "ok", payload: product });
    } catch (err) {
      console.error(err);
      res.send(err.message);
    }
  }

  async deleteById(req, res) {
    const { pid } = req.params;
    try {
      const findById = await productDao.getById(pid);
      if (!findById)
        return res.json({
          status: "error",
          message: `Product id ${pid} not found`,
        });
      const product = await productDao.delete(pid);

      res.json({ status: "ok", payload: `Product id ${pid} deleted` });
    } catch (err) {
      console.error(err);
      res.status(404).send(err.message);
    }
  }
}

export const productController = new ProductController();
