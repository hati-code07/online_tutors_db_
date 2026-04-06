module.exports = (app) => {
  const payments = require("../controllers/payments.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * tags:
   *   name: Payments
   *   description: Payments management
   */

  /**
   * @swagger
   * /api/payments:
   *   post:
   *     summary: Create payment
   *     tags: [Payments]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PaymentInput'
   *     responses:
   *       200:
   *         description: Payment created
   *   get:
   *     summary: Get all payments
   *     tags: [Payments]
   *     responses:
   *       200:
   *         description: Payments list
   */

  /**
   * @swagger
   * /api/payments/raw/by-status:
   *   get:
   *     summary: Get payments by status with raw SQL
   *     tags: [Payments]
   *     parameters:
   *       - in: query
   *         name: status
   *         required: true
   *         schema:
   *           type: string
   *           enum: [pending, paid, failed, refunded]
   *     responses:
   *       200:
   *         description: Filtered payments
   */

  /**
   * @swagger
   * /api/payments/{id}:
   *   get:
   *     summary: Get payment by id
   *     tags: [Payments]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Payment found
   *   put:
   *     summary: Update payment
   *     tags: [Payments]
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
   *             $ref: '#/components/schemas/PaymentInput'
   *     responses:
   *       200:
   *         description: Payment updated
   *   delete:
   *     summary: Delete payment
   *     tags: [Payments]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Payment deleted
   */

  router.post("/", payments.create);
  router.get("/", payments.findAll);
  router.get("/raw/by-status", payments.findByStatusRaw);
  router.get("/:id", payments.findOne);
  router.put("/:id", payments.update);
  router.delete("/:id", payments.delete);

  app.use("/api/payments", router);
};
