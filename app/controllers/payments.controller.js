const db = require("../models");
const Payment = db.payments;
const { QueryTypes } = db.Sequelize;

const VALID_STATUSES = ["pending", "paid", "failed", "refunded"];

const mapPayment = (payment) => ({
  id: Number(payment.id),
  lesson_id: Number(payment.lesson_id),
  student_id: Number(payment.student_id),
  tutor_id: Number(payment.tutor_id),
  amount: Number(payment.amount),
  status: payment.status,
  paid_at: payment.paid_at
});

exports.create = (req, res) => {
  if (
    req.body.lesson_id == null ||
    req.body.student_id == null ||
    req.body.tutor_id == null ||
    req.body.amount == null
  ) {
    return res.status(400).send({ message: "Missing fields" });
  }

  if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
    return res.status(400).send({ message: "Invalid payment status" });
  }

  Payment.create(req.body)
    .then(data => res.status(201).send(mapPayment(data)))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Payment.findAll({
    include: ["lesson", "student", "tutor"],
    order: [["id", "ASC"]]
  })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findByStatusRaw = async (req, res) => {
  const { status } = req.query;

  if (!status) {
    return res.status(400).send({ message: "status query parameter is required" });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).send({ message: "Invalid payment status" });
  }

  try {
    const rows = await db.sequelize.query(
      `SELECT
         p.id,
         p.lesson_id,
         p.student_id,
         p.tutor_id,
         p.amount,
         p.status,
         p.paid_at,
         student.name AS student_name,
         tutor.name AS tutor_name
       FROM payments p
       JOIN users student ON student.id = p.student_id
       JOIN users tutor ON tutor.id = p.tutor_id
       WHERE p.status = :status
       ORDER BY p.id`,
      {
        replacements: { status },
        type: QueryTypes.SELECT
      }
    );

    const payments = rows.map(row => ({
      id: Number(row.id),
      lesson_id: Number(row.lesson_id),
      student_id: Number(row.student_id),
      tutor_id: Number(row.tutor_id),
      amount: Number(row.amount),
      status: row.status,
      paid_at: row.paid_at,
      student_name: row.student_name,
      tutor_name: row.tutor_name
    }));

    res.send(payments);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = (req, res) => {
  Payment.findByPk(req.params.id, { include: ["lesson", "student", "tutor"] })
    .then(data => {
      if (!data) return res.status(404).send({ message: "Payment not found" });
      res.send(data);
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
    return res.status(400).send({ message: "Invalid payment status" });
  }

  Payment.update(req.body, { where: { id: req.params.id } })
    .then(([count]) => {
      if (!count) return res.status(404).send({ message: "Payment not found" });
      res.send({ message: "Updated!" });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  Payment.destroy({ where: { id: req.params.id } })
    .then(count => {
      if (!count) return res.status(404).send({ message: "Payment not found" });
      res.send({ message: "Deleted!" });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};
