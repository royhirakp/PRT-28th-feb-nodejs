const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const ContactSchma  = new Schema({   
    firstName: String,
    lastName: String,
    email: { type:String ,required: true},
    phone: { type:String ,required: true}

  })
  const ContactModel = mongoose.model('User', ContactSchma ); // NOT COMPLITED 
  module.exports = ContactModel;