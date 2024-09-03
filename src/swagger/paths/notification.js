/**
 * @swagger
 * tags:
 *   - name: Notification
 *     description: Notification related endpoints
 */

/**
 * @swagger
 * /notification:
 *   post:
 *     summary: Create a new notification
 *     description: Creates a new notification in the system using the data provided in the request body.
 *     tags:
 *       - Notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: array
 *                 description: Array of user IDs who will receive the notification
 *                 items:
 *                   type: string
 *                 example: ["60d21b4667d0d8992e610c85", "60d21b5667d0d8992e610c86"]
 *               subject:
 *                 type: string
 *                 description: The subject of the notification
 *                 example: "System Update"
 *               content:
 *                 type: string
 *                 description: The content/message of the notification
 *                 example: "The system will undergo maintenance on 2024-09-05."
 *               media:
 *                 type: string
 *                 description: URL of any media associated with the notification
 *                 example: "https://example.com/media/image.png"
 *               link:
 *                 type: string
 *                 description: Optional link related to the notification
 *                 example: "https://example.com/update-details"
 *               type:
 *                 type: string
 *                 description: The type of notification (e.g., "email", "in-app")
 *                 example: "email"
 *     responses:
 *       200:
 *         description: Notification created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal Server Error
 */
