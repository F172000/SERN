const bcrypt=require('bcrypt');
const jwt=require( 'jsonwebtoken');
const User =require( '../Module/user.model.js'); // Assuming you have a User model defined
const ENV =require( '../config.js'); 
const sequelize=require('../database/Connection.js');
const otpGenerator=require('otp-generator');
/**middleware for verify user */
exports.verifyuser=async(req,res,next)=>{

try{
  console.log('Received req.query:', req.query);
    console.log('Received req.body:', req.body);
  const { username } = req.method === 'GET' ? req.query : req.body;
console.log('Received username:', username);
// const username=req.body;
// console.log('Received username:', username);
//check the user existance
let exist=await sequelize.models.User.findOne({where:{username}});
console.log(exist);
if(!exist) {
  return res.status(404).send({error:"Can't find user"});
}
else {
  console.log('inside next');
  next();
}
}catch(error){
return res.status(404).send({error:'Authentication Error'});
}
}
exports.register=async(req, res)=> {
    const { username, email, profile, password } = req.body;
    console.log(username,email,profile,password);
    const hashedPassword = await bcrypt.hash(password, 10);
console.log(hashedPassword);
    // Add a new user record
    try {
      // Add a new user record using Sequelize's create() method
      const newUser = await User.create({
        username,
        password: hashedPassword,
        email,
        profile,
      });
  
      // User registered successfully
      return res.status(200).send({ msg: 'User is registered successfully' });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({ msg: 'User registration failed' });
    }
}
  exports.login=async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
  
    try {
      const user = await sequelize.models.User.findOne({ where: { username } });
      console.log(user);
  
      if (!user) {
        console.log('Username not found');
        return res.status(404).send({ error: 'Username not found' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log(passwordMatch);
  
      if (!passwordMatch) {
        console.log('Password does not match');
        return res.status(400).send({ error: 'Password does not match' });
      }
  
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
        },
        ENV.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      console.log('Login successful');
      return res.status(200).send({
        msg: 'Login successful',
        username: user.username,
        token,
      });
    } catch (error) {
      console.log('Error:', error);
      return res.status(500).send({ error: 'An error occurred during login' });
    }
  };
  /**GET: http://localhost:8080/api/users/example123 */
  exports.getUser=async(req,res)=>{
    const {username}=req.params;
    console.log(username);
    try{
      if(!username)
      {
      return res.status(501).send({error:"Invalid Username"});
      } 
      if(username)
      {
      const user = await sequelize.models.User.findOne({ where: { username } });
      if(!user) {
        return res.status(501).send({error:'could not find the user'});
            }
    // sequelize.models.User.findOne({ where: { username } },function(err,user){
    // if(err) {
    // return res.status(500).send({error:'Invalid username'});
    //   }
    // if(!user) {
    // return res.status(501).send({error:'could not find the user'});
    //     }
    const {password,...rest}=Object.assign({},user.toJSON());
    return res.status(201).send(rest);
        }
      }
     catch(error){
      return res.status(404).send({error:'Cannot find user data'});
      }
}
 /**PUT: http://localhost:8080/api/updateuser */
 exports.updateUser = async (req, res) => {
  try {
    // const id = req.query.id;
    const {userId}=req.user;
    console.log(userId);
    if (userId) {
      const body = req.body;
      // Update the data
      const [updatedRows] = await sequelize.models.User.update(body, {
        where: { id: userId },
      });
      if (updatedRows === 0) {
        return res.status(404).send({ error: 'User Not Found...!' });
      }
      return res.status(201).send({ msg: 'Record Updated...!' });
    } else {
      return res.status(401).send({ error: 'User Not Found...!' });
    }
  } catch (error) {
    return res.status(500).send({ error: 'Internal Server Error' });
  }
}


// exports.getUser = async (req, res) => {
//   const { username } = req.params;
//   console.log(username);
//   try {
//     if (!username) {
//       throw new Error("Invalid Username");
//     }
//     sequelize.models.User.findOne({ where: { username } }, function (err, user) {
//       if (err) {
//         return res.status(500).send({ error: 'Invalid username' });
//       }
//       if (!user) {
//         return res.status(501).send({ error: 'Could not find the user' });
//       }
//       return res.status(201).send(user);
//     });
//   } catch (error) {
//     return res.status(501).send({ error: error.message });
//   }
// }
 /**PUT: http://localhost:8080/api/updateuser */
// exports.updateUser=async(req,res)=>{
//   try{
// const id=req.query.id;
// if(id){
// const body =req.body;
// //update the data
// sequelize.models.User.updateOne({_id:id},body,function(err,data){
//   if(err) throw err;
//   return res.status(201).send({msg:'Record Updated...!'});
// });
// }else {
//   return res.status(401).send({error:'User Not Found...!'});
// }
//   }catch(error){
// return res.status(401).send({error:'User Not Found...!'});
//   }
//         // res.json('update user route');
// }
exports.generateOTP=async(req,res)=>{
  req.app.locals.OTP=await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
res.status(201).send({code:req.app.locals.OTP});
    // res.json('generateOTP route');
    }
exports.verifyOTP=async(req,res)=>{
  const {code}=req.query;
  if(parseInt(req.app.locals.OTP)===parseInt(code)){
    req.app.locals.OTP=null;//reset the otp value
    req.app.locals.resetSession=true;//start reset session for reset password
    return res.status(201).send({msg:'Verify successfully'});  
  }
  return res.status(400).send({error:'Invalid OTP'});
}
//successfully redirect the user when OTP is valid
/**GET:http://localhost:8080/api/CreateResetSession */
exports.CreateResetSession=async(req,res)=>{
  if(req.app.locals.resetSession){
    // req.app.locals.resetSession=false;//allow access to this route only once
    return res.status(201).send({flag:req.app.locals.resetSession});
  }
  return res.status(440).send({error:"Session expired!"})
        // res.json('CreateResetSession route');
        }
     /**PUT:http:localhost:8080/api/resetPassword */   
// exports.resetPassword=async(req,res)=>{
//   console.log("inside Reset Password");
//            try{
// const {username,password}=req.body;
// console.log(username,password);
// try{
//   await sequelize.models.User.findOne({where:{username}}).then(user=>{
//     bcrypt.hash(password,10)
//     .then(hashedPassword=>{
//       const result=sequelize.models.User.update({username:user.username},{password:hashedPassword});
//       if(!result){
//       return res.status(400).send({error:'User Password is not updated'});
//       }
//       else{
//         return res.status(200).send({msg:'User Password is updated'})
//       }
//     })
//     .catch(e=>{
//       return res.status(500).send({
//         error:"Enable to hashed password"
//       })
//     });
//   }).catch(error=>{
// return res.status(404).send({error:'Username not Found'})
//   })

// }catch(error){
//   return res.status(500).send({error})
// }
//            }catch(error){
//             return res.status(401).send({error})
//            }
//             }
exports.resetPassword = async (req, res) => {
  console.log("Inside Reset Password");
  try {
    if(!req.app.locals.resetSession){
      return res.status(440).send({error:"Session expired!"});
    }
    const { username, password } = req.body;
    console.log(username, password);
    try {
      const user = await User.findOne({where: {username} });
      console.log(user);
      if (!user) {
        return res.status(404).send({ error: 'Username not found' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await User.update(
        { password: hashedPassword },
        { where: { username: user.username } }
      );

      if (result=== 0) {
        return res.status(400).send({ error: 'User password is not updated' });
      } else {
        req.app.locals.resetSession=false;
        return res.status(200).send({ msg: 'User password is updated' });
      }
    } catch (error) {
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  } catch (error) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
};
