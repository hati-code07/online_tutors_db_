module.exports = (sequelize, Sequelize) => {
  const TutorSubject = sequelize.define("tutor_subject", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tutor_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    },
    subject_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "subjects",
        key: "id"
      }
    },
    price_per_hour: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: "tutor_subjects",
    timestamps: false
  });

  return TutorSubject;
};