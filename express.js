// load config
const AppError = require('./errors/appError');
require('dotenv').config();
const express = require('express');
const {catchAsync} = require('./utils/catchAsync');
const {check, validationResult} = require('express-validator');

// create app
const app = express();

// use json body parser middleware
app.use(express.json());

// timeout
app.use((req, res, next) => {
    res.setTimeout(process.env.TIMEOUT || 5000, function () {
        req.timedOut = true;
        return  next(new AppError('timeout'));
    });
    return  next();
});

app.post('/path',[
    // define express validator rule
    check('a').isInt({min:1,max:5}).withMessage('params error')
],catchAsync(async (req,res,next)=>{
    const errors = validationResult(req);
    // check errors
    if (!errors.isEmpty()){
        const errorInfo = errors.array().map(e => e.msg).join('; ')
        throw new AppError(errorInfo);
    }
    res.status(200).json({success:true,error:null,data:null});
}));

// handle other request
app.all('*', (req, res, next) => {
    return  next(new AppError(`403`));
});

// caught all error
app.use((err,req,res,next)=>{
    if (err){
        const body = {success:false,error:null,data:null};
        if (err instanceof AppError){
            body.error = err.message;
        }else{
            body.error = 'unknown error';
        }
        return res.status(422).json(body);
    }
});

// other uncaught
process.on('uncaughtException',function (){});
process.on('uncaughtExceptionMonitor',function (){});
process.on('unhandledRejection',function (){});

// listen port
app.listen(process.env.PORT || 8080);
