// console.log('app')
require('dotenv/config');
const express = require('express')
const app = express();
app.use(express.json())
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const { body } = require('express-validator')

//MODEL NAME
const ContactModel = require('./src/models/ComtactModel')

//Connect Database
async function conntectDtabase() {
  try {
    await mongoose.connect(process.env.mogourl);
    console.log('connccred database sucessfull!!!!!!!')
  } catch (error) {
    console.log(error)
  }
}
conntectDtabase()
//************************************************************************** */
//ROUTES
//1. > Post A NEW CONTACT
app.post("/v1/contacts", body('email').isEmail(), async (req, res) => {
  try {
    const contact = await ContactModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone
    })
    res.status(201).json(contact)

  } catch (error) {
    // console.log(error.errors?.email?.path)
    // console.log(error.errors?.phone?.path)
    //   console.log(error)
    //LOGIC FOR SHOW PARTICULER ERROR 
    if (error.errors?.email?.path && error.errors?.phone?.path) {
      return (res.json({
        error: "Missing required field(s):" + error.errors?.email?.path + ", " + error.errors?.phone?.path
      }))
    } else if (error.errors?.email?.path === undefined && error.errors?.phone?.path) {
      return (res.json({
        error: "Missing required field(s):" + error.errors?.phone?.path
      }))
    } else if (error.errors?.email?.path && error.errors?.phone?.path === undefined) {
      return (res.json({
        error: "Missing required field(s):" + error.errors?.email?.path
      }))
    }

    res.json({
      status: "Failed",
      error
    })
  }
})
//****************************************************** */
//2.GET ALL CONTACTS 

app.get("/v1/contacts", async (req, res) => {
  try {
    const contact = await ContactModel.find()
    res.status(200).json(contact)
  } catch (error) {
    res.json({
      status: "Failed",
      error
    })
  }
})

///********************************************************* */
//3. GET A SPICIFIC CONTACT  
app.get("/v1/contacts/:ID", async (req, res) => {
  try {
    const contact = await ContactModel.find({ _id: req.params.ID })
    if (contact.length === 0) {
      return (
        res.status(404).json({
          error: "Thre is no contact with that id"
        }))
    }
    res.status(200).json(contact[0])
  } catch (error) {
    res.status(404).json({
      error: "Thre is no contact with that id"
    })
  }
})

//************************************************************* */
//4. delete a spicific contact   
app.delete('/v1/contacts/:ID', async (req, res) => {
  console.log(">>>> commingggg   delete")
  try {
    await ContactModel.deleteOne({ _id: req.params.ID })
    res.status(204).json()
  } catch (error) {
    res.status(404).json({
      error
    })
  }
})
//*************************************************************** */
//5.update a spicific contct  
app.put('/v1/contacts/:ID', async (req, res) => {
  console.log('put is working ')
  try {
    const contact = await ContactModel.updateOne({ _id: req.params.ID }, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone
      }
    })
    if (contact.matchedCount === 0) {
      return (
        res.status(404).json({
          error: "Thre is no contact with that id"
        }))
    }
    res.status(204).json()
  } catch (error) {
    res.status(404).json({
      error: "Thre is no contact with that id"
    })
  }
})
//*********************************************************** */
//6> update a spicifi contact with spifici data  
app.patch('/v1/contacts/:ID', async (req, res) => {
  try {
    const contact = await ContactModel.updateOne({ _id: req.params.ID }, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone
      }
    })
    if (contact.matchedCount === 0) {
      return (
        res.status(404).json({
          error: "Thre is no contact with that id"
        }))
    }
    res.status(204).json();

  } catch (error) {
    res.status(404).json({
      error: "Thre is no contact with that id"
    })
  }
})

//BAD REQUEST
app.use('*', (req, res) => {
  res.status(404).json({
    status: "worong url! 404 not found"
  })
})

app.listen(process.env.port, () => {
  console.log(`Example app listening on port ${process.env.port}`)
})
