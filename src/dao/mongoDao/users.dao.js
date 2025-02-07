import { userModel } from "../models/users.model.js";

class UserDao {
  async getAll() {
    return await userModel.find();
  }

  async getById(id) {
    return await userModel.findById(id);
  }

  async create(data) {
    return await userModel.create(data);
  }

  async update(id, data) {
    return await userModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteUser(id) {
    return await userModel.findByIdAndDelete(id);
  }
}

export const userDao = new UserDao();
