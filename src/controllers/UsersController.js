const AppError = require("../utils/AppError");

class UsersController {
  create(req, res) {
    const { name, email, password } = req.body;

    if(!name) {
      throw new AppError("name must be provided");
    }

    res.status(201).json({ name, email, password });
  }
}

module.exports = UsersController;