
const Router=require('express');
const router=Router();
const controller=require('../controllers/appcontroller.js');
const auth=require('../middleware/auth.js');
const registerMail=require('../controllers/Mailer.js');
/**Post methods */

router.route('/register').post(controller.register);
router.route('/registerMail').post(registerMail.registerMail);//send the email
router.route('/authentication').post(controller.verifyuser,(req,res)=>res.end());//authenticate the user
router.route('/login').post(controller.verifyuser,controller.login);//login the app
/**GEt methods */
router.route('/users/:username').get(controller.getUser);//get user with username
router.route('/generateOTP').get(controller.verifyuser,auth.localVariables,controller.generateOTP);//generate random OTP
router.route('/verifyOTP').get(controller.verifyOTP);//verify generated OTP 
router.route('/CreateResetSession').get(controller.CreateResetSession);//reset all the variables

 
/**Put methods */
router.route('/updateuser').put(auth.auth,controller.updateUser);//is used to update the user profile
router.route('/resetPassword').put(controller.verifyuser,controller.resetPassword);//use to reset password
module.exports=router;