/**
 * @swagger
 * tags:
 *   - name: Report
 *     description: Report related endpoints
 */

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Create a report
 *     description: Create a new report with the specified details.
 *     tags:
 *       - Report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Issue with event scheduling"
 *               reportType:
 *                 type: string
 *                 example: "post"
 *               reportTo:
 *                 type: string
 *                 example: "643a12b4e6c12d1d14e9f875"
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get a list of reports
 *     description: Retrieve a paginated list of reports.
 *     tags:
 *       - Report
 *     parameters:
 *       - name: pageNo
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: search
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: "event"
 *     responses:
 *       200:
 *         description: Reports found successfully
 *       500:
 *         description: Internal server error
 */
