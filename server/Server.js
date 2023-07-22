const express=require('express');
const cors=require('cors');
const morgan =require('morgan');
const router=require('./Router/Route.js')
const {sequelize}=require('./database/Connection.js');
const User=require('./Module/user.model.js');
const app=express();
/**middleware */
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');//less hackers know about our stack
const port=8080;
/** HTTP request */
User.sync();
app.get('/',(req,res)=>{
    res.status(201).json("Home Get Request");
});
/**api routes */


app.use('/api',router);

        app.listen(port,()=>{
            console.log(`server connected to http://localhost:${port}`);
        });

