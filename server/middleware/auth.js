const jwt=require( 'jsonwebtoken');
const ENV =require( '../config.js'); 
exports.auth=async(req,res,next)=>{
    try{
//access authorize header to validate request
const token=req.headers.authorization.split(" ")[1];

//retrive the user details for the logged in user
const decodedtoken=await jwt.verify(token,ENV.JWT_SECRET);
req.user=decodedtoken;
next();
// res.json(decodedtoken);
    }
    catch(error){
     res.status(401).json({error:'Authentication failed'});
    }
}
exports.localVariables=async(req,res,next)=>{
req.app.locals={
    OTP:null,
    resetSession:false
}
next();
}