module.exports = (app) => {
  const lessons = require("../controllers/lessons.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * tags:
   *   name: Lessons
   *   description: Lessons management
   */

  /**
   * @swagger
   * /api/lessons:
   *   post:
   *     summary: Create lesson
   *     tags: [Lessons]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LessonInput'
   *     responses:
   *       200:
   *         description: Lesson created
   *   get:
   *     summary: Get all lessons
   *     tags: [Lessons]
   *     responses:
   *       200:
   *         description: Lessons list
   */

  /**
   * @swagger
   * /api/lessons/by-date:
   *   get:
   *     summary: Get lessons by date range with raw SQL
   *     tags: [Lessons]
   *     parameters:
   *       - in: query
   *         name: start
   *         required: true
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: end
   *         required: true
   *         schema:
   *           type: string
   *           format: date-time
   *     responses:
   *       200:
   *         description: Filtered lessons
   */

  /**
   * @swagger
   * /api/lessons/{id}:
   *   get:
   *     summary: Get lesson by id
   *     tags: [Lessons]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Lesson found
   *   put:
   *     summary: Update lesson
   *     tags: [Lessons]
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
   *             $ref: '#/components/schemas/LessonInput'
   *     responses:
   *       200:
   *         description: Lesson updated
   *   delete:
   *     summary: Delete lesson
   *     tags: [Lessons]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Lesson deleted
   */

  router.post("/", lessons.create);
  router.get("/", lessons.findAll);
  router.get("/by-date", lessons.findByDateRangeRaw);
  router.get("/:id", lessons.findOne);
  router.put("/:id", lessons.update);
  router.delete("/:id", lessons.delete);

  app.use("/api/lessons", router);
};
