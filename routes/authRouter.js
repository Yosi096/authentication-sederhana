const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../key')
const router = express.Router();
const User = mongoose.model('User');

router.post('/signup',async (req,res)=>{
    const {username, email, password} = req.body;

    try{
      const data = new User({
        username,email,password
      });

      if(!username || !email || !password){
        return res.status(422).json({success: false, message: "Tidak boleh ada yang kosong"});
      }

      const emails = await User.findOne({email})
      if(emails){
          return res.status(422).json({success: false, message: "Email telah terdaftar di sistem."});
      }

      await  data.save();
      const token = jwt.sign({userId:data._id},jwtkey)
      res.send({
        success: true,
        token
    })

    }catch(err){
      return res.status(422).json({success: false, message: err.message});
    }
})

router.post('/signin',async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({success: false, message: "Tidak boleh ada yang kosong"});
    }
    const data = await User.findOne({email})
    if(!data){
        return res.status(422).json({success: false, message: "Email belum terdaftar di sistem."});
    }
    try{
      await data.comparePassword(password);    
      const token = jwt.sign({userId:data._id},jwtkey)
      res.send({token})
    }catch(err){
        return res.status(422).json({success: false, message: err.message});
    }
})

router.get('/getAll', async(req, res) => {
  try{
    const data = await User.find()
    res.status(200).json({
      success: true,
      data: data
    })
  }catch(err){
    return res.status(422).json({success: false, message: err.message});
  }
})

router.delete('/:userId', async(req, res) => {
  try{
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({
      success: true,
      message: "Berhasil dihapus"
    })
  }catch(err){
    return res.status(422).json({success: false, message: err.message});
  }
})

module.exports = router