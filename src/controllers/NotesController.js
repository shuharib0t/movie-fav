const knex = require("../database/knex");

class NotesController {
  async create(req, res) {
    const { title, description, rating, tags } = req.body;
    const { user_id } = req.params;

    const [ note_id ] = await knex("movie_notes").insert({
      title,
      description,
      user_id,
      rating
    });

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    })

    await knex("movie_tags").insert(tagsInsert);

    res.json();
  }

  async show (req, res) {
    const { id } = req.params;

    const movieNote = await knex("movie_notes").where({ id }).first();
    const movieTags = await knex("movie_tags").where({ note_id: id }).orderBy("name");

    return res.json({
      ...movieNote,
      movieTags
    });
  }

  async delete (req, res) {
    const { id } = req.params;

    await knex("movie_notes").where({ id }).delete();

    return res.json();
  }
}

module.exports = NotesController;