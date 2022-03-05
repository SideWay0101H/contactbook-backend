const mongoose = require("mongoose");
const { BadEequestError } = require("../errors")
const handlePromise = require("../helpers/promise.helpers");
const Contact = require("../models/contacts.model");


exports.findAll = async (req,res,next) =>{
    const condition = { };
    const {name} = req.query;
    if(name){
        condition.name ={$regex: new RegExp(name), $option: "i"};

    }
      
    const [error , documents] = await handlePromise(Contact.find(condition));
    if(error){
        return  next(new BadRequestError(500,
            "An error occurred  while  retrieving contacts"));
    }
    return res.send(documents);
}

exports.findOne = async (req,res,next) =>{
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id: null,
    };

    const [error, document] = await handlePromise(Contact.findOne(condition));
    if(error){
        return next(new BadRequestError(500,
            `Error retrieving contact with id=${req.params.id}`));
    }
    
    if(!document){
        return next(new BadRequestError(404,"Contact not found"));

    }
     return res.send(document);
}

exports.update = async (req,res,next) =>{
    if(Object.keys(req.body).length === 0){
        return next(new BadRequestError(404,
            "Data to update can not be empty"));
        }
     const { id } = req.params;
     const condition = {
         _id: id && mongoose.isValidObjectId(id) ? id : null,
     };

     const [error,document] = await  handlePromise(
         Contact.findOneAndUpdate(condition, req,body, {
              new: true,
         })
     );

     if (error) {
         return next(new BadRequestError(500,
            `Error updating  contact with id=${req.params.id}`));
     }

      if(!document){
          return next(new BadRequestError(404, "Contact not found"));
      }

       return res.send({message : "Contact was updated successfully",});

};

exports.delete = async (req,res,next) =>{
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null, 
    };
    const [ error, document] = await handlePromise(
        Contact.findOneAndDelete(condition)
    );
    if(error){
        return next(new BadRequestError(500,
            `Could not delete contact with id=${req.params.id}`));
    }

    if(!document) {
        return next(new BadRequestError(404, "Contact not found"));
    }

    return res.send({ message : "Contact was  deleted successfully",});
};

exports.findAllFavorite = async (req,res,next) => {
    const [error, documents] = await handlePromise(
        Contact.find({ favorite : true,})
    );
    if(error) {
        return next(new BadRequestError(500, 
            "An error occurred while  retrieving favorite contacts"));
    }
     return res.send(documents);
}

exports.deleteAll = async(req, res, next) => {
    const [error, data] = await handlePromise(
        Contact.deleteMany({})
    );
    if(error){
         return next(new BadRequestError(500,
            "An  error occurred while  removing all contacts"));
    }

    return res.send({
        message : `${data.deleletedCount} contacts were deleted successfully`, 
    });
};


exports.create = async (req,res,next) => {
    //validate request
    if(!req.body.name){
        return next(new BadRequestError(400, "Name can not be empty"));
    }

    //create a contact
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        favorite: req.body.favorite === true,
    });
  
     try{
         //save contact in the the database
         const document = await contact.save();
         return  res.send(document);
     } catch (error) {
       return next(
           new BadrequestError(
               500,
               "An error occurred  while creating the contact"
           )
        );
     }  
};