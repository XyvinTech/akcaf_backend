/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User related endpoints
 */

/**
 * @swagger
 * /user/admin:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the provided details. Access is restricted based on permissions.
 *     tags:
 *       - User
 *     requestBody:
 *       description: Details of the user to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   first:
 *                     type: string
 *                     example: "John"
 *                   middle:
 *                     type: string
 *                     example: "A."
 *                   last:
 *                     type: string
 *                     example: "Doe"
 *               college:
 *                 type: string
 *                 example: "66cef851d3cbe59728a7d474"
 *               batch:
 *                 type: number
 *                 example: 2022
 *               designation:
 *                 type: string
 *                 example: "Software Engineer"
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               bio:
 *                 type: string
 *                 example: "Passionate developer with experience in full-stack development."
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden, user lacks permissions
 *       409:
 *         description: Conflict, user with this email or phone already exists
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/admin/single/{id}:
 *   put:
 *     summary: Edit a user
 *     description: Updates a user's details based on the provided information. Access is restricted based on permissions.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *           example: "6123abc456def7890ghi1234"
 *     requestBody:
 *       description: Details to update for the user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   first:
 *                     type: string
 *                     example: "John"
 *                   middle:
 *                     type: string
 *                     example: "A."
 *                   last:
 *                     type: string
 *                     example: "Doe"
 *               college:
 *                 type: string
 *                 example: "XYZ University"
 *               batch:
 *                 type: number
 *                 example: 2022
 *               designation:
 *                 type: string
 *                 example: "Software Engineer"
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               bio:
 *                 type: string
 *                 example: "Experienced developer specializing in full-stack development."
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input or User ID is missing
 *       403:
 *         description: Forbidden, user lacks permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /users/admin/single/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieves a user's details based on the provided user ID. Access is restricted based on permissions.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *           example: "6123abc456def7890ghi1234"
 *     responses:
 *       200:
 *         description: User found successfully
 *       400:
 *         description: User ID is missing
 *       403:
 *         description: Forbidden, user lacks permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /users/admin/single/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a user based on the provided user ID. Access is restricted based on permissions.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *           example: "6123abc456def7890ghi1234"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: User ID is missing
 *       403:
 *         description: Forbidden, user lacks permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
