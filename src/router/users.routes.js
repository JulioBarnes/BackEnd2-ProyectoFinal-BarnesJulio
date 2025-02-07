import { Router } from "express";
import { userDao } from "../dao/mongoDao/users.dao.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const user = await userDao.getAll();

    res.json({ status: "ok", payload: user });
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
});

router.get("/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await userDao.getById(uid);
    if (!user)
      return res.json({
        status: "error",
        message: `User id ${uid} not found`,
      });

    res.json({ status: "ok", payload: user });
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
});
router.post("/", async (req, res) => {
  const body = req.body;
  try {
    const user = await userDao.create(body);

    res.json({ status: "ok", payload: user });
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
});

router.put("/:uid", async (req, res) => {
  const { uid } = req.params;
  const { name, age, email } = req.body;
  try {
    const findUser = await userDao.getById(uid);
    if (!findUser)
      return res.json({
        status: "error",
        message: `User id ${uid} not found`,
      });

    const user = await userDao.update(
      uid,
      {
        name: name ?? findUser.name,
        age: age ?? findUser.age,
        email: email ?? findUser.email,
      },
      { new: true }
    );

    res.json({ status: "ok", payload: user });
  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});

router.delete("/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await userDao.getById(uid);
    if (!user)
      return res.json({
        status: "error",
        message: `User id ${uid} not found`,
      });

    const removeUser = await userDao.deleteUser(uid);

    res.status(200).json({
      status: "success",
      message: `User id ${uid} removed `,
      payload: removeUser,
    });
  } catch (err) {
    console.error(err);
    res.send(err.message);
  }
});
export default router;
