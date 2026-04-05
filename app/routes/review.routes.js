module.exports = (app) => {
  const reviews = require("../controllers/reviews.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * tags:
   *   name: Reviews
   *   description: Reviews management
   */

  /**
   * @swagger
   * /api/reviews:
   *   post:
   *     summary: Create review
   *     tags: [Reviews]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ReviewInput'
   *     responses:
   *       200:
   *         description: Review created
   *   get:
   *     summary: Get all reviews
   *     tags: [Reviews]
   *     responses:
   *       200:
   *         description: Reviews list
   */

  /**
   * @swagger
   * /api/reviews/raw/tutor-stats:
   *   get:
   *     summary: Get tutor review statistics with raw SQL
   *     tags: [Reviews]
   *     parameters:
   *       - in: query
   *         name: tutorId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Tutor review statistics
   */

  /**
   * @swagger
   * /api/reviews/{id}:
   *   get:
   *     summary: Get review by id
   *     tags: [Reviews]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Review found
   *   put:
   *     summary: Update review
   *     tags: [Reviews]
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
   *             $ref: '#/components/schemas/ReviewInput'
   *     responses:
   *       200:
   *         description: Review updated
   *   delete:
   *     summary: Delete review
   *     tags: [Reviews]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Review deleted
   */

  router.post("/", reviews.create);
  router.get("/", reviews.findAll);
  router.get("/raw/tutor-stats", reviews.findTutorStatsRaw);
  router.get("/:id", reviews.findOne);
  router.put("/:id", reviews.update);
  router.delete("/:id", reviews.delete);

  app.use("/api/reviews", router);
};
