const nodemailer=require('nodemailer');
const mailgen =require('mailgen');
const ENV =require('../config');
//https://ethereal.email/create
let nodeConfig={
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: ENV.EMAIL,
      pass: ENV.PASSWORD
    }
  }
  let transporter=nodemailer.createTransport(nodeConfig);
  let Mailgenerator=new mailgen({
    theme:'default',
    product:{
        name:'Mailgen',
        link:'https://mailgen.js/'
    }
  });

  /**POST:http://localhost:8080/api/registerMail
   * @params:{
   * "username":"example123",
   * "password":"admin123",
   * "text":"",
   * "subject":"",
   * }
   */
  exports.registerMail=async(req,res)=>{
    const {username,userEmail,text,subject}=req.body;
    console.log(username,userEmail,text,subject);
    //body of the mail
    var email={
        body:{
            name:username,
            intro:text||'Welocome to Daily Tuition! We are very excited to have you on board',
            outro:'Need help, or have question? Just reply to this email, we love to help',

        }
    }
    var emailBody=Mailgenerator.generate(email);
    let message={
        from:ENV.EMAIL,
        to:userEmail,
        subject:subject || 'sign up successful...!',
        html:emailBody
    }
    transporter.sendMail(message).then(()=>{
        return res.status(200).send({msg:'You should recieve an email from us'})
    }).catch(error=>res.status(500).send({error}))
  }