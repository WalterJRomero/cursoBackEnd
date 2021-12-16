import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import Chats from './classes/Chats.js';
import router from './routes/products.js';
import cartRouter from './routes/cart.js'
import {Server} from 'socket.io'
import __dirname from './utils.js'
import moment from 'moment';
import productConteiner from './services/productConteiner.js';
import chatConteiner from './services/chatConteiner.js'

const productService = new productConteiner();
const chatService = new chatConteiner();
const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>{
    console.log('Server listening on port: '+PORT)
})
export const io = new Server(server);
export const admin=true;

app.engine('handlebars',engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log('Peticion hecha a las: '+time.toTimeString().split(" ")[0],req.method,req.url);    
    req.auth = admin
    next();
})

app.use(express.static(__dirname+'/public'));
app.use('/api/products',router);
app.use('/api/cart',cartRouter)

app.get('/views/products',(req,res)=>{
    productService.getAll().then(result=>{
        let {data}=result;        
        let preparedObj={
            products : data
        }
        res.render('products',preparedObj);
    })   
})

//muestra los productos que tengo actualmente
io.on('connection',async socket=>{
    console.log(`Socket ${socket.id} connected`);
    let products = await productService.getAll();
    socket.emit('updateProducts',products)
   
})
//muestra si estas logueado como admin
io.on('connection',async socket=>{    
    let auth = admin;
    socket.emit('auth',auth)   
})

//Chats en pantalla-----------------------------------------
  

io.on('connection',async socket=>{     
    let {data} = await chatService.getAllChats()    
    socket.emit('messagelog',data)        
    socket.on('message',async res=>{             
        let date = moment().format('DD/MM/YYYY HH:mm:ss')        
        res.date = date                 
        let result = await chatService.saveChats(res)         
        let chatData = await chatService.getAllChats()        
        io.emit('messagelog',chatData.data)       
    })             
})

app.use('/*', function(req, res){
    let error = {
        route:req.params[0],
        method:req.method,
    }    
    res.render('error',error)
});
