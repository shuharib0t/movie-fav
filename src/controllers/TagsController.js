const knex = require("../database/knex");

class TagsController {
  async index(req, res) {
    const { user_id } = req.params;

    const movieTags = await knex("movie_tags")
    .where({ user_id })

    return res.json(movieTags)
  }
}

module.exports = TagsController;