const db = require("../models");
const TutorSubject = db.tutorSubjects;
const { QueryTypes } = db.Sequelize;

exports.create = (req, res) => {
  if (
    req.body.tutor_id == null ||
    req.body.subject_id == null ||
    req.body.price_per_hour == null
  ) {
    return res.status(400).send({ message: "Missing fields" });
  }

  TutorSubject.create(req.body)
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  TutorSubject.findAll({ include: ["tutor", "subject"] })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findByPriceRangeRaw = async (req, res) => {
  const { minPrice = 0, maxPrice = 999999 } = req.query;

  try {
    const rows = await db.sequelize.query(
      `SELECT
         ts.id,
         ts.tutor_id,
         ts.subject_id,
         ts.price_per_hour,
         u.name AS tutor_name,
         s.name AS subject_name
       FROM tutor_subjects ts
       JOIN users u ON u.id = ts.tutor_id
       JOIN subjects s ON s.id = ts.subject_id
       WHERE ts.price_per_hour BETWEEN :minPrice AND :maxPrice
       ORDER BY ts.price_per_hour, ts.id`,
      {
        replacements: { minPrice, maxPrice },
        type: QueryTypes.SELECT
      }
    );

    const tutorSubjects = rows.map(row => ({
      id: Number(row.id),
      tutor_id: Number(row.tutor_id),
      subject_id: Number(row.subject_id),
      price_per_hour: Number(row.price_per_hour),
      tutor_name: row.tutor_name,
      subject_name: row.subject_name
    }));

    res.send(tutorSubjects);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = (req, res) => {
  TutorSubject.findByPk(req.params.id, { include: ["tutor", "subject"] })
    .then(data => {
      if (!data) return res.status(404).send({ message: "Tutor subject not found" });
      res.send(data);
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  TutorSubject.update(req.body, { where: { id: req.params.id } })
    .then(([count]) => {
      if (!count) return res.status(404).send({ message: "Tutor subject not found" });
      res.send({ message: "Updated!" });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  TutorSubject.destroy({ where: { id: req.params.id } })
    .then(count => {
      if (!count) return res.status(404).send({ message: "Tutor subject not found" });
      res.send({ message: "Deleted!" });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};
