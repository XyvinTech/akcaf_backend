/**
 * @swagger
 * tags:
 *   - name: Payment
 *     description: Payment related endpoints
 */

/**
 * @swagger
 * /payment/make-payment:
 *   post:
 *     summary: Create a new payment
 *     description: Initiates a payment process using Razorpay and saves the payment details in the database.
 *     tags:
 *       - Payment
 *     responses:
 *       200:
 *         description: Payment created successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /payment/razorpay-callback:
 *   post:
 *     summary: Handle Razorpay payment callback
 *     description: Verifies the payment signature and updates the payment status in the database based on the callback from Razorpay.
 *     tags:
 *       - Payment
 *     parameters:
 *       - name: paymentId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           description: The ID of the payment to update.
 *     requestBody:
 *       description: The request body contains the Razorpay payment details to verify and update the payment status.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpayPaymentId:
 *                 type: string
 *                 description: The ID of the payment from Razorpay.
 *               razorpayOrderId:
 *                 type: string
 *                 description: The ID of the order from Razorpay.
 *               razorpaySignature:
 *                 type: string
 *                 description: The signature generated by Razorpay to verify the payment.
 *             required:
 *               - razorpayPaymentId
 *               - razorpayOrderId
 *               - razorpaySignature
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       400:
 *         description: Invalid signature or request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /payment/list:
 *   get:
 *     summary: Get all payments
 *     description: Retrieve a paginated list of all payments with an optional status filter.
 *     tags:
 *       - Payment
 *     parameters:
 *       - name: pageNo
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page.
 *       - name: status
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Payment status filter.
 *     responses:
 *       200:
 *         description: Successfully retrieved payment list
 *       400:
 *         description: Bad request, invalid parameters
 *       500:
 *         description: Internal Server Error
 */