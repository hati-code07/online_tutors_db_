module.exports = (app) => {
  const users = require("../controllers/users.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * tags:
   *   name: Users
   *   description: User management
   */

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserInput'
   *     responses:
   *       200:
   *         description: User created
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Users list
   */

  /**
   * @swagger
   * /api/users/raw/by-role:
   *   get:
   *     summary: Get users by role with raw SQL
   *     tags: [Users]
   *     parameters:
   *       - in: query
   *         name: role
   *         required: true
   *         schema:
   *           type: string
   *           enum: [student, tutor, admin]
   *     responses:
   *       200:
   *         description: Filtered users
   */

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Get user by id
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: User found
   *   put:
   *     summary: Update user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserInput'
   *     responses:
   *       200:
   *         description: User updated
   *   delete:
   *     summary: Delete user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: User deleted
   */

  router.post("/", users.create);
  router.get("/", users.findAll);
  router.get("/raw/by-role", users.findByRoleRaw);
  router.get("/:id", users.findOne);
  router.put("/:id", users.update);
  router.delete("/:id", users.delete);

  app.use("/api/users", router);
};
