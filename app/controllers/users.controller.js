const db = require("../models");
const User = db.users;
const { QueryTypes } = db.Sequelize;

const USER_PUBLIC_ATTRIBUTES = ["id", "name", "email", "role", "created_at"];

const mapUser = (user) => ({
  id: Number(user.id),
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.created_at
});

const isValidRole = (role) => ["student", "tutor", "admin"].includes(role);

exports.create = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password_hash || !req.body.role) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  if (!isValidRole(req.body.role)) {
    return res.status(400).send({ message: "Invalid role value" });
  }

  User.create(req.body)
    .then(data => res.status(201).send(mapUser(data)))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  User.findAll({ attributes: USER_PUBLIC_ATTRIBUTES, order: [["id", "ASC"]] })
    .then(data => res.send(data.map(mapUser)))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findByRoleRaw = async (req, res) => {
  const { role } = req.query;

  if (!role) {
    return res.status(400).send({ message: "role query parameter is required" });
  }

  try {
    const rows = await db.sequelize.query(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE role = :role
       ORDER BY id`,
      {
        replacements: { role },
        type: QueryTypes.SELECT
      }
    );

    const users = rows.map(mapUser);

    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = (req, res) => {
  User.findByPk(req.params.id, { attributes: USER_PUBLIC_ATTRIBUTES })
    .then(data => {
      if (!data) return res.status(404).send({ message: "User not found" });
      res.send(mapUser(data));
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  if (req.body.role && !isValidRole(req.body.role)) {
    return res.status(400).send({ message: "Invalid role value" });
  }

  User.update(req.body, { where: { id: req.params.id } })
    .then(([count]) => {
      if (!count) return res.status(404).send({ message: "User not found" });
      res.send({ message: "Updated!" });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  User.destroy({ where: { id: req.params.id } })
    .then(count => {
      if (!count) return res.status(404).send({ message: "User not found" });
      res.send({ message: "Deleted!" });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and password required" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    if (user.password_hash !== password) {
      return res.status(401).send({ message: "Wrong password" });
    }

    const token = "user-" + user.id;

    res.send({
      token,
      user: mapUser(user)
    });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};