module.exports = (app) => {
  const subjects = require("../controllers/subjects.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * tags:
   *   name: Subjects
   *   description: Subjects management
   */

  /**
   * @swagger
   * /api/subjects:
   *   post:
   *     summary: Create subject
   *     tags: [Subjects]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SubjectInput'
   *     responses:
   *       200:
   *         description: Subject created
   *   get:
   *     summary: Get all subjects
   *     tags: [Subjects]
   *     responses:
   *       200:
   *         description: Subjects list
   */

  /**
   * @swagger
   * /api/subjects/raw/search:
   *   get:
   *     summary: Search subjects by name with raw SQL
   *     tags: [Subjects]
   *     parameters:
   *       - in: query
   *         name: name
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Filtered subjects
   */

  /**
   * @swagger
   * /api/subjects/{id}:
   *   get:
   *     summary: Get subject by id
   *     tags: [Subjects]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Subject found
   *   put:
   *     summary: Update subject
   *     tags: [Subjects]
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
   *             $ref: '#/components/schemas/SubjectInput'
   *     responses:
   *       200:
   *         description: Subject updated
   *   delete:
   *     summary: Delete subject
   *     tags: [Subjects]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Subject deleted
   */

  router.post("/", subjects.create);
  router.get("/", subjects.findAll);
  router.get("/raw/search", subjects.searchByNameRaw);
  router.get("/:id", subjects.findOne);
  router.put("/:id", subjects.update);
  router.delete("/:id", subjects.delete);

  app.use("/api/subjects", router);
};
