const responseHandler = require("../helpers/responseHandler");

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const to = req.params.id;
    const from = req.userId;
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
