/**
 * @swagger
 * tags:
 *   - name: Course
 *     description: Course related endpoints
 */

/**
 * @swagger
 * /course:
 *   post:
 *     summary: Create new Course
 *     description: Creates a new Course with the provided details.
 *     tags:
 *       - Course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *                 example: "MCA"
 *     responses:
 *       201:
 *         description: New Course created successfullyy
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /course/list:
 *   get:
 *     summary: Get a list of course
 *     description: Retrieves list of course
 *     tags:
 *       - Course
 *     responses:
 *       200:
 *         description: successfullyy retrieved the list of course
 *       500:
 *         description: Internal Server Error
 */
