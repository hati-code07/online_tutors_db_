module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    role: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['student', 'tutor', 'admin']]
      }
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: "users",
    timestamps: false
  });

  return User;
};