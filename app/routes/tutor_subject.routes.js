module.exports = (app) => {
  const tutorSubjects = require("../controllers/tutor_subject.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * tags:
   *   name: TutorSubjects
   *   description: Tutor subjects and pricing
   */

  /**
   * @swagger
   * /api/tutor-subjects:
   *   post:
   *     summary: Create tutor subject relation
   *     tags: [TutorSubjects]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TutorSubjectInput'
   *     responses:
   *       200:
   *         description: Tutor subject created
   *   get:
   *     summary: Get all tutor subjects
   *     tags: [TutorSubjects]
   *     responses:
   *       200:
   *         description: Tutor subject list
   */

  /**
   * @swagger
   * /api/tutor-subjects/raw/by-price:
   *   get:
   *     summary: Get tutor subjects by price range with raw SQL
   *     tags: [TutorSubjects]
   *     parameters:
   *       - in: query
   *         name: minPrice
   *         required: false
   *         schema:
   *           type: number
   *       - in: query
   *         name: maxPrice
   *         required: false
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: Filtered tutor subjects
   */

  /**
   * @swagger
   * /api/tutor-subjects/{id}:
   *   get:
   *     summary: Get tutor subject by id
   *     tags: [TutorSubjects]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Tutor subject found
   *   put:
   *     summary: Update tutor subject
   *     tags: [TutorSubjects]
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
   *             $ref: '#/components/schemas/TutorSubjectInput'
   *     responses:
   *       200:
   *         description: Tutor subject updated
   *   delete:
   *     summary: Delete tutor subject
   *     tags: [TutorSubjects]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Tutor subject deleted
   */

  router.post("/", tutorSubjects.create);
  router.get("/", tutorSubjects.findAll);
  router.get("/raw/by-price", tutorSubjects.findByPriceRangeRaw);
  router.get("/:id", tutorSubjects.findOne);
  router.put("/:id", tutorSubjects.update);
  router.delete("/:id", tutorSubjects.delete);

  app.use("/api/tutor-subjects", router);
};
