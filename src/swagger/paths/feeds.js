/**
 * @swagger
 * tags:
 *   - name: Feeds
 *     description: Feeds related endpoints
 */

/**
 * @swagger
 * /feeds:
 *   post:
 *     summary: Create new feeds
 *     description: Creates a new feed with the provided details.
 *     tags:
 *       - Feeds
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "Article"
 *               media:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               link:
 *                 type: string
 *                 example: "https://example.com/article"
 *               content:
 *                 type: string
 *                 example: "This is the content of the feed..."
 *     responses:
 *       201:
 *         description: New Feeds created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /feeds/single/{id}:
 *   get:
 *     summary: Get feed by ID
 *     description: Retrieves a specific feed by its ID.
 *     tags:
 *       - Feeds
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the feed to retrieve
 *     responses:
 *       200:
 *         description: Feed found successfully
 *       400:
 *         description: Bad Request - Invalid ID or ID not provided
 *       404:
 *         description: Feed not found
 *       500:
 *         description: Internal Server Error
 */
