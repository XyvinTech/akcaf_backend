// TODO swagger

/**
 * @swagger
 * tags:
 *   - name: Event
 *     description: Event related endpoints
 */

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Create a new event
 *     description: This endpoint allows the creation of a new event. It validates the input data and checks for the existence of the event by its name.
 *     tags:
 *       - Event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *                 description: The name of the event
 *                 example: "Sample Event"
 *               type:
 *                 type: string
 *                 description: The type of the event
 *                 example: "Workshop"
 *               image:
 *                 type: string
 *                 description: Upload the event image
 *               startDate:
 *                 type: date
 *                 format: date
 *                 description: The start date of the event
 *                 example: "2024-08-29"
 *               startTime:
 *                 type: date
 *                 description: The start time of the event in HH:MM format
 *                 example: "14:30"
 *               endDate:
 *                 type: date
 *                 format: date
 *                 description: The end date of the event
 *                 example: "2024-08-30"
 *               endTime:
 *                 type: date
 *                 description: The end time of the event in HH:MM format
 *                 example: "16:00"
 *               platform:
 *                 type: string
 *                 description: The platform where the event will be held
 *                 example: "Zoom"
 *               link:
 *                 type: string
 *                 description: The event link URL
 *                 example: "https://example.com/event"
 *               venue:
 *                 type: string
 *                 description: The venue of the event
 *                 example: "Main Auditorium"
 *               speakers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of speakers for the event
 *                 example: ["Joy", "Arun"]
 *             required:
 *               - eventName
 *               - type
 *               - startDate
 *               - endDate
 *     responses:
 *       201:
 *         description: New event created successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Event with this name already exists
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /event/single/{id}:
 *   get:
 *     summary: Get an event by ID
 *     description: Retrieve an event using its unique ID.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /event/single/{id}:
 *   put:
 *     summary: Edit an Existing Event By Id
 *     description: Update an existing event by ID.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *                 description: The name of the event
 *                 example: "Sample Event"
 *               type:
 *                 type: string
 *                 description: The type of the event
 *                 example: "Workshop"
 *               image:
 *                 type: string
 *                 description: Upload the event image
 *               startDate:
 *                 type: date
 *                 format: date
 *                 description: The start date of the event
 *                 example: "2024-08-29"
 *               startTime:
 *                 type: date
 *                 description: The start time of the event in HH:MM format
 *                 example: "14:30"
 *               endDate:
 *                 type: date
 *                 format: date
 *                 description: The end date of the event
 *                 example: "2024-08-30"
 *               endTime:
 *                 type: date
 *                 description: The end time of the event in HH:MM format
 *                 example: "16:00"
 *               platform:
 *                 type: string
 *                 description: The platform where the event will be held
 *                 example: "Zoom"
 *               link:
 *                 type: string
 *                 description: The event link URL
 *                 example: "https://example.com/event"
 *               venue:
 *                 type: string
 *                 description: The venue of the event
 *                 example: "Main Auditorium"
 *               speakers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of speakers for the event
 *                 example: ["John", "Alex"]
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /event/single/{id}:
 *   delete:
 *     summary: Delete an Event By Id
 *     description: Delete an existing event by its ID.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /event:
 *   get:
 *     summary: Get all events
 *     description: Retrieve all events from the database.
 *     tags:
 *       - Event
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *       404:
 *         description: No events found
 *       500:
 *         description: Internal Server Error
 */
