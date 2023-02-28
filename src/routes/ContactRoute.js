const express = require('express');
const router = express.Router();
const RouteModel = require('../models/ComtactModel')

router.get("/", async (req,res)=>{
    res.json({
        status:'wo route'
    })
})