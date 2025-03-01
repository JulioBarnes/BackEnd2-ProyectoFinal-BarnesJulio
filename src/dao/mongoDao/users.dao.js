import { usersModel } from "../models/users.model.js";

class UsersDao {
  async getAll() {
    return await usersModel.find();
  }

  async getById(id) {
    return await usersModel.findById(id);
  }

  async create(data) {
    return await usersModel.create(data);
  }

  async update(id, data) {
    return await usersModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async delete(id) {
    return await usersModel.findByIdAndDelete(id);
  }
}

export const usersDao = new UsersDao();
