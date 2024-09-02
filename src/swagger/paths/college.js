/**
 * @swagger
 * tags:
 *   - name: College
 *     description: College related endpoints
 */

/**
 * @swagger
 * /college:
 *   post:
 *     summary: Create a new college
 *     description: This endpoint allows the creation of a new college. It validates the input data and checks for the existence of the college by its name. If the college already exists, it returns a 409 status code.
 *     tags:
 *       - College
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collegeName:
 *                 type: string
 *                 description: The name of the college
 *                 example: "ABC University"
 *               course:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The courses offered by the college
 *                 example: ['66cef851d3cbe59728a7d474', '66cef851d3cbe59728a7d474']
 *               startYear:
 *                 type: number
 *                 description: The year the college started
 *                 example: 2015
 *               country:
 *                 type: string
 *                 description: The country where the college is located
 *                 example: "India"
 *               state:
 *                 type: string
 *                 description: The state where the college is located
 *                 example: "Kerala"
 *             required:
 *               - collegeName
 *               - startYear
 *               - country
 *               - state
 *     responses:
 *       201:
 *         description: New College created successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: College with this name already exists
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /college/single/{id}:
 *   put:
 *     summary: Edit an existing college
 *     description: This endpoint allows you to update the details of an existing college entry in the database. It validates the input data before updating.
 *     tags:
 *       - College
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the college to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collegeName:
 *                 type: string
 *                 description: The name of the college
 *                 example: "ABC College"
 *               course:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The courses offered by the college
 *                 example: ['66cef851d3cbe59728a7d474', '66cef851d3cbe59728a7d474']
 *               batch:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: The list of batches associated with the college
 *                 example: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
 *               country:
 *                 type: string
 *                 description: The country where the college is located
 *                 example: "India"
 *               state:
 *                 type: string
 *                 description: The state where the college is located
 *                 example: "Kerala"
 *               status:
 *                 type: boolean
 *                 description: The status of the college (active/inactive)
 *                 example: true
 *     responses:
 *       200:
 *         description: College updated successfully
 *       400:
 *         description: Invalid input or missing College ID
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /college/single/{id}:
 *   get:
 *     summary: Get a college by ID
 *     description: This endpoint retrieves the details of a college based on its ID.
 *     tags:
 *       - College
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the college to retrieve
 *     responses:
 *       200:
 *         description: College found successfully
 *       400:
 *         description: Invalid or missing College ID
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /college/single/{id}:
 *   delete:
 *     summary: Delete a college by ID
 *     description: This endpoint deletes a college record based on its ID.
 *     tags:
 *       - College
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the college to delete
 *     responses:
 *       200:
 *         description: College deleted successfully
 *       400:
 *         description: Invalid or missing College ID
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /college/bulk:
 *   post:
 *     summary: Bulk create colleges
 *     description: This endpoint allows for the bulk creation of multiple college records.
 *     tags:
 *       - College
 *     requestBody:
 *       description: An array of college objects to be created in bulk.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 collegeName:
 *                   type: string
 *                   example: "ABC University"
 *                 startYear:
 *                   type: number
 *                   example: 2000
 *                 country:
 *                   type: string
 *                   example: "India"
 *                 state:
 *                   type: string
 *                   example: "Kerala"
 *     responses:
 *       201:
 *         description: Colleges created successfully
 *       400:
 *         description: Invalid input or duplicate college names found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /college/list:
 *   get:
 *     summary: Get a list of colleges
 *     description: Retrieves a paginated list of colleges with optional filtering by status.
 *     tags:
 *       - College
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
 *         description: Filter colleges by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of colleges per page (defaults to 10)
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of colleges
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /college/dropdown:
 *   get:
 *     summary: Get a dropdown of colleges
 *     description: Retrieves a dropdown of colleges.
 *     tags:
 *       - College
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of colleges
 *       500:
 *         description: Internal Server Error
 */
