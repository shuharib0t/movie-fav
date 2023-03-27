const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(req, res) {
    const { name, email, password, avatar } = req.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [ email ]);

    if(checkUserExists) {
      throw new AppError("that e-mail already exists");
    }

    const hashedPassword = await hash(password, 8);

    await database.run("INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)", [ name, email, hashedPassword, avatar ]);

    return res.status(201).json();
    // if(!name) {
    //   throw new AppError("name must be provided");
    // }

    // res.status(201).json({ name, email, password, avatar });
  }

  async update(req, res) {
    const { name, email, avatar, password, old_password, } = req.body;
    const { id } = req.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [ id ]);

    if(!user) {
      throw new AppError("user not found");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [ email ]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("email already exists");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.avatar = avatar ?? user.avatar;

    if(password && !old_password) {
      throw new AppError("you need to pass a old password to change the password");
    }

    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if(!checkOldPassword) {
        throw new AppError("old password is wrong")
      }

      user.password = await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET 
      name = ?,
      email = ?,
      password = ?,
      avatar = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user.avatar, id]
    );

    return res.status(200).json();
  }
}

module.exports = UsersController;