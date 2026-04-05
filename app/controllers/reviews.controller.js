const db = require("../models");
const Review = db.reviews;
const { QueryTypes } = db.Sequelize;

exports.create = (req, res) => {
  if (
    req.body.student_id == null ||
    req.body.tutor_id == null ||
    req.body.rating == null
  ) {
    return res.status(400).send({ message: "Missing fields" });
  }

  if (req.body.rating < 1 || req.body.rating > 5) {
    return res.status(400).send({ message: "Rating must be between 1 and 5" });
  }

  Review.create(req.body)
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Review.findAll({ include: ["student", "tutor"] })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findTutorStatsRaw = async (req, res) => {
  const { tutorId } = req.query;

  if (!tutorId) {
    return res.status(400).send({ message: "tutorId query parameter is required" });
  }

  try {
    const rows = await db.sequelize.query(
      `SELECT
         tutor_id,
         COUNT(*) AS reviews_count,
         ROUND(AVG(rating)::numeric, 2) AS average_rating
       FROM reviews
       WHERE tutor_id = :tutorId
       GROUP BY tutor_id`,
      {
        replacements: { tutorId },
        type: QueryTypes.SELECT
      }
    );

    const stats = rows.map(row => ({
      tutor_id: Number(row.tutor_id),
      reviews_count: Number(row.reviews_count),
      average_rating: Number(row.average_rating)
    }));

    res.send(stats);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = (req, res) => {
  Review.findByPk(req.params.id, { include: ["student", "tutor"] })
    .then(data => {
      if (!data) return res.status(404).send({ message: "Review not found" });
      res.send(data);
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  Review.update(req.body, { where: { id: req.params.id } })
    .then(([count]) => {
      if (!count) return res.status(404).send({ message: "Review not found" });
      res.send({ message: "Updated!" });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  Review.destroy({ where: { id: req.params.id } })
    .then(count => {
      if (!count) return res.status(404).send({ message: "Review not found" });
      res.send({ message: "Deleted!" });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};
