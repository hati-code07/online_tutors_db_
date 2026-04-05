const db = require("../models");
const Subject = db.subjects;
const { QueryTypes } = db.Sequelize;

exports.create = (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({ message: "Name required" });
  }

  Subject.create(req.body)
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Subject.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.searchByNameRaw = async (req, res) => {
  const { name = "" } = req.query;

  try {
    const rows = await db.sequelize.query(
      `SELECT id, name
       FROM subjects
       WHERE name ILIKE :namePattern
       ORDER BY name`,
      {
        replacements: { namePattern: `%${name}%` },
        type: QueryTypes.SELECT
      }
    );

    const subjects = rows.map(row => ({
      id: Number(row.id),
      name: row.name
    }));

    res.send(subjects);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = (req, res) => {
  Subject.findByPk(req.params.id)
    .then(data => {
      if (!data) return res.status(404).send({ message: "Subject not found" });
      res.send(data);
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  Subject.update(req.body, { where: { id: req.params.id } })
    .then(([count]) => {
      if (!count) return res.status(404).send({ message: "Subject not found" });
      res.send({ message: "Updated!" });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  Subject.destroy({ where: { id: req.params.id } })
    .then(count => {
      if (!count) return res.status(404).send({ message: "Subject not found" });
      res.send({ message: "Deleted!" });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};
