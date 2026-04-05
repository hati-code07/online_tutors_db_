module.exports = (sequelize, Sequelize) => {
  const Lesson = sequelize.define("lesson", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
    subject_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "subjects",
        key: "id"
      }
    },
    start_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(20),
      defaultValue: "scheduled",
      validate: {
        isIn: [['scheduled', 'completed', 'cancelled']]
      }
    }
  }, {
    tableName: "lessons",
    timestamps: false
  });

  return Lesson;
};