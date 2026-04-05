module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "online_tutors_db",
  PASSWORD: process.env.DB_PASSWORD || "1111",
  DB: process.env.DB_NAME || "online_tutors_db",
  PORT: process.env.DB_PORT || 5434,

  dialect: "postgres",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};