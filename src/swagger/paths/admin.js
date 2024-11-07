/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin related endpoints
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     description: API endpoint for admin login
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Create a new admin
 *     description: API endpoint to create a new admin
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               college:
 *                 type: string
 *                 example: "666c1a3895a6b176b7f2bcf7"
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               phone:
 *                 type: string
 *                 example: "+123456789"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 example: "666c1a3895a6b176b7f2bcf7"
 *     responses:
 *       200:
 *         description: Admin created successfullyy
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get an admin
 *     description: API endpoint to get an existing admin
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin retrieved successfullyy
 *       404:
 *         description: Admin not found
 */

/**
 * @swagger
 * /admin/list:
 *   get:
 *     summary: Get a list of admins
 *     description: Retrieves a paginated list of admins with optional filtering by status.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: pageNo
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (defaults to 1)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter admins by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of admins per page (defaults to 10)
 *     responses:
 *       200:
 *         description: successfullyy retrieved the list of admins
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/single/{id}:
 *   get:
 *     summary: Get a Admin by ID
 *     description: Retrieves a admin's details based on the provided admin ID. Access is restricted based on permissions.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the admin to retrieve
 *         schema:
 *           type: string
 *           example: "6123abc456def7890ghi1234"
 *     responses:
 *       200:
 *         description: Admin found successfullyy
 *       400:
 *         description: Admin ID is missing
 *       403:
 *         description: Forbidden, admin lacks permissions
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/approvals:
 *   get:
 *     summary: Get a list of users awaiting approval
 *     description: Retrieves a paginated list of users with an "inactive" status, awaiting approval.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: pageNo
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (defaults to 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of users per page (defaults to 10)
 *     responses:
 *       200:
 *         description: successfullyy retrieved the list of users awaiting approval
 *       403:
 *         description: Forbidden - User does not have permission to view approvals
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/approval/{id}:
 *   put:
 *     summary: Approve or update a user's status
 *     description: Approves or updates the status of a user based on the provided user ID. The user must have the "memberManagement_modify" permission to perform this action.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to approve or update
 *         schema:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the user (e.g., "active", "rejected", etc.)
 *                 example: "active"
 *     responses:
 *       200:
 *         description: User status updated successfullyy
 *       400:
 *         description: User ID is required or User update failed
 *       403:
 *         description: Access denied due to insufficient permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /admin/dropdown:
 *   get:
 *     summary: Get dropdown list of active users
 *     description: Returns a list of active users with their IDs and email addresses. Requires proper permissions.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Dropdown found successfullyy
 *       403:
 *         description: Forbidden - You don't have permission to perform this action
 *       500:
 *         description: Internal Server Error
 */
