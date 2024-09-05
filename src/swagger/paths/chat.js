/**
 * @swagger
 * tags:
 *   - name: Chat
 *     description: Chat related endpoints
 */

/**
 * @swagger
 * /chat/create-group:
 *   post:
 *     summary: Create a new group chat
 *     description: Creates a new group chat with the specified participants and group name.
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupName:
 *                 type: string
 *                 description: The name of the group chat
 *                 example: "Project Team"
 *               groupInfo:
 *                 type: string
 *                 description: Additional information about the group
 *               participantIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *                 description: List of participant IDs to be added to the group
 *                 example:
 *                   - "60d21b4667d0d8992e610c85"
 *                   - "60d21b4667d0d8992e610c86"
 *     responses:
 *       201:
 *         description: Group chat created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /chat/get-chats:
 *   get:
 *     summary: Get chat threads
 *     description: Retrieves all chat threads that the authenticated user is a part of.
 *     tags:
 *       - Chat
 *     responses:
 *       200:
 *         description: Chat threads retrieved successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /chat/group-message/{id}:
 *   get:
 *     summary: Get group chat messages
 *     description: Retrieves all messages in a specific group chat by group ID. Marks all messages as "seen" for the authenticated user.
 *     tags:
 *       - Chat
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The ID of the group chat
 *     responses:
 *       200:
 *         description: Group messages retrieved successfully
 *       404:
 *         description: No messages found in this group
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /chat/between-users/{id}:
 *   get:
 *     summary: Get chat messages between two users
 *     description: Retrieves all chat messages between the authenticated user and another user identified by the user ID in the path.
 *     tags:
 *       - Chat
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: The ID of the other user
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       404:
 *         description: No messages found between the users
 *       500:
 *         description: Internal Server Error
 */
