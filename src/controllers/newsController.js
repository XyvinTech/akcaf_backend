const moment = require('moment-timezone')
const responseHandler = require('../helpers/responseHandler')
const News = require('../models/newsModel')
const validations = require("../validations")


exports.createNews = async (req, res) => {
      try {
    const createNewsValidator= validations.createNewsSchema.validate(req.body, {
      abortEarly: true,
    });

    if (createNewsValidator.error) {
      return responseHandler(res, 400, `Invalid input: ${createNewsValidator.error}`);
    }


      const newNews = await News.create(req.body)
      if (!newNews) {
        return responseHandler(res, 400, `news creation failed...!`);
      }
      return responseHandler( res,201, `New news created successfull..!`,newNews)
    } 
      catch (error) {
      return responseHandler(res, 500, `Internal Server Error ${error.message}`);
    }
}
  
  //get
  exports.getNews = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
          return responseHandler(res, 400, "news with this Id is required");
        }
    
        const findNews = await News.findById(id);
        if (findNews) {
          return responseHandler(
            res,
            200,
            `news found successfull..!`,
            findNews
          );
        }
      } catch (error) {
        return responseHandler(res, 500, `Internal Server Error ${error.message}`);
      }
  };
  
 
  // Update 
  exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
          return responseHandler(res, 400, "news Id is required");
        }
    
        const { error } = validations.editNewsSchema.validate(req.body, {
          abortEarly: true,
        });
    
        if (error) {
          return responseHandler(res, 400, `Invalid input: ${error.message}`);
        }
    
        const updateNews = await News.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (this.updateNews) {
          return responseHandler(
            res,
            200,
            `News updated successfull..!`,
            updateNews
          );
        }
      } catch (error) {
        return responseHandler(res, 500, `Internal Server Error ${error.message}`);
      }
  };
  
  // Delete 
  exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
          return responseHandler(res, 400, "News Id is required");
        }
    
        const deleteNews = await News.findByIdAndDelete(id);
        if (deleteNews) {
          return responseHandler(res, 200, `news deleted successfull..!`);
        }
      } catch (error) {
        return responseHandler(res, 500, `Internal Server Error ${error.message}`);
      }
  };
  
  