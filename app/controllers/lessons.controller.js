const db = require("../models");
const Lesson = db.lessons;
const { QueryTypes } = db.Sequelize;

exports.create = (req, res) => {
  if (
    req.body.student_id == null ||
    req.body.tutor_id == null ||
    !req.body.start_time ||
    !req.body.end_time
  ) {
    return res.status(400).send({ message: "Missing fields" });
  }

  Lesson.create(req.body)
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Lesson.findAll({ include: ["student", "tutor", "subject"] })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findByDateRangeRaw = async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).send({ message: "start and end query parameters are required" });
  }

  try {
    const rows = await db.sequelize.query(
      `SELECT
         l.id,
         l.student_id,
         l.tutor_id,
         l.subject_id,
         l.start_time,
         l.end_time,
         l.status,
         student.name AS student_name,
         tutor.name AS tutor_name,
         s.name AS subject_name
       FROM lessons l
       JOIN users student ON student.id = l.student_id
       JOIN users tutor ON tutor.id = l.tutor_id
       LEFT JOIN subjects s ON s.id = l.subject_id
       WHERE l.start_time >= :startDate
         AND l.end_time <= :endDate
       ORDER BY l.start_time`,
      {
        replacements: { startDate: start, endDate: end },
        type: QueryTypes.SELECT
      }
    );

    const lessons = rows.map(row => ({
      id: Number(row.id),
      student_id: Number(row.student_id),
      tutor_id: Number(row.tutor_id),
      subject_id: row.subject_id === null ? null : Number(row.subject_id),
      start_time: row.start_time,
      end_time: row.end_time,
      status: row.status,
      student_name: row.student_name,
      tutor_name: row.tutor_name,
      subject_name: row.subject_name
    }));

    res.send(lessons);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = (req, res) => {
  Lesson.findByPk(req.params.id, { include: ["student", "tutor", "subject"] })
    .then(data => {
      if (!data) return res.status(404).send({ message: "Lesson not found" });
      res.send(data);
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  Lesson.update(req.body, { where: { id: req.params.id } })
    .then(([count]) => {
      if (!count) return res.status(404).send({ message: "Lesson not found" });
      res.send({ message: "Updated!" });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  Lesson.destroy({ where: { id: req.params.id } })
    .then(count => {
      if (!count) return res.status(404).send({ message: "Lesson not found" });
      res.send({ message: "Deleted!" });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};
