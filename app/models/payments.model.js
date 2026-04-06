module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define("payment", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    lesson_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "lessons",
        key: "id"
      }
    },
    student_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    },
    tutor_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    status: {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "paid", "failed", "refunded"]]
      }
    },
    paid_at: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    tableName: "payments",
    timestamps: false
  });

  return Payment;
};
