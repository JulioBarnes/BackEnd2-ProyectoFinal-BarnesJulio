import { usersDao } from "../dao/mongoDao/users.dao.js";

class UsersController {
  async getAll(req, res) {
    try {
      const user = await usersDao.getAll();

      res.json({ status: "ok", payload: user });
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  }
  async getById(req, res) {
    const { uid } = req.params;
    try {
      const user = await usersDao.getById(uid);
      if (!user)
        return res.json({
          status: "error",
          message: `User id ${uid} not found`,
        });

      res.json({ status: "ok", payload: user });
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  }
}

export const usersController = new UsersController();
