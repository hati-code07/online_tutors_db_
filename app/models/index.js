const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    define: {
      underscored: true
    },
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    },
    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users.model.js")(sequelize, Sequelize);
db.subjects = require("./subjects.model.js")(sequelize, Sequelize);
db.tutorSubjects = require("./tutor_subject.model.js")(sequelize, Sequelize);
db.lessons = require("./lessons.model.js")(sequelize, Sequelize);
db.reviews = require("./reviews.model.js")(sequelize, Sequelize);
db.payments = require("./payments.model.js")(sequelize, Sequelize);

db.users.hasMany(db.tutorSubjects, {
  foreignKey: "tutor_id",
  as: "tutorSubjects"
});

db.tutorSubjects.belongsTo(db.users, {
  foreignKey: "tutor_id",
  as: "tutor"
});

db.subjects.hasMany(db.tutorSubjects, {
  foreignKey: "subject_id",
  as: "tutorSubjects"
});

db.tutorSubjects.belongsTo(db.subjects, {
  foreignKey: "subject_id",
  as: "subject"
});

db.users.hasMany(db.lessons, {
  foreignKey: "student_id",
  as: "studentLessons"
});

db.users.hasMany(db.lessons, {
  foreignKey: "tutor_id",
  as: "tutorLessons"
});

db.lessons.belongsTo(db.users, {
  foreignKey: "student_id",
  as: "student"
});

db.lessons.belongsTo(db.users, {
  foreignKey: "tutor_id",
  as: "tutor"
});

db.subjects.hasMany(db.lessons, {
  foreignKey: "subject_id",
  as: "lessons"
});

db.lessons.belongsTo(db.subjects, {
  foreignKey: "subject_id",
  as: "subject"
});

db.users.hasMany(db.reviews, {
  foreignKey: "student_id",
  as: "givenReviews"
});

db.users.hasMany(db.reviews, {
  foreignKey: "tutor_id",
  as: "receivedReviews"
});

db.reviews.belongsTo(db.users, {
  foreignKey: "student_id",
  as: "student"
});

db.reviews.belongsTo(db.users, {
  foreignKey: "tutor_id",
  as: "tutor"
});

db.lessons.hasMany(db.payments, {
  foreignKey: "lesson_id",
  as: "payments"
});

db.payments.belongsTo(db.lessons, {
  foreignKey: "lesson_id",
  as: "lesson"
});

db.users.hasMany(db.payments, {
  foreignKey: "student_id",
  as: "studentPayments"
});

db.users.hasMany(db.payments, {
  foreignKey: "tutor_id",
  as: "tutorPayments"
});

db.payments.belongsTo(db.users, {
  foreignKey: "student_id",
  as: "student"
});

db.payments.belongsTo(db.users, {
  foreignKey: "tutor_id",
  as: "tutor"
});

module.exports = db;
