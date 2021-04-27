const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan');
const { error, success } = require('consola');
const cors = require('cors')

const app = express()
const PORT = 3000
const { mongoUrl } = require('./key')

require('./models/User');

app.use(morgan('dev'))
const requireToken = require('./middleware/requireToken')
const authRoutes = require('./routes/authRouter')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.use(authRoutes)

mongoose.connect(mongoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex: true
})

mongoose.connection.on('connected',()=>{
  success({
    message: 'Connected to mongo', 
    badge: true
  })
})

mongoose.connection.on('error',(err)=>{
    console.log("this is error",err)
})

app.get('/',requireToken,(req,res)=>{
    res.send({email:req.user.email})
})

app.listen(PORT,()=>{
  success({
    message: `Server started on port `+PORT, 
    badge: true
  })
})