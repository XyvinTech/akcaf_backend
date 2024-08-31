/**
 * @swagger
 * tags:
 *   - name: News
 *     description: News related endpoints
 */

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a new news article
 *     description: Creates a new news article with the provided details.
 *     tags:
 *       - News
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "Technology"
 *               title:
 *                 type: string
 *                 example: "New Tech Innovations in 2024"
 *               content:
 *                 type: string
 *                 example: "Details about the latest technology innovations..."
 *               media:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               status:
 *                 type: string
 *                 example: "Published"
 *     responses:
 *       201:
 *         description: New news created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /news/single/{id}:
 *   put:
 *     summary: Edit an existing news article
 *     description: Updates the details of an existing news article by ID.
 *     tags:
 *       - News
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the news article to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               media:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: News article updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: News article not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /news/single/{id}:
 *   get:
 *     summary: Get a news article by ID
 *     description: Retrieves the details of a specific news article by ID.
 *     tags:
 *       - News
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the news article to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: News article retrieved successfully
 *       404:
 *         description: News article not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /news/single/{id}:
 *   delete:
 *     summary: Delete a news article by ID
 *     description: Deletes a specific news article by ID.
 *     tags:
 *       - News
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the news article to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: News article deleted successfully
 *       404:
 *         description: News article not found
 *       500:
 *         description: Internal Server Error
 */
