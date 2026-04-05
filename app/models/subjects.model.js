module.exports = (sequelize, Sequelize) => {
  const Subject = sequelize.define("subject", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: "subjects",
    timestamps: false
  });

  return Subject;
};