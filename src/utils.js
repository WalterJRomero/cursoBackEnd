import { fileURLToPath } from "url";
import {dirname} from 'path';
import faker from 'faker';
import bcrypt from 'bcrypt'
import winston from "winston";

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

export const createLogger = (env) =>{
    if (env==="PROD"){
        return winston.createLogger({
            transports:[
                new winston.transports.File({filename:"info.log",level:"info"}),
                new winston.transports.File({filename:"errors.log",level:"error"}),
                new winston.transports.File({filename:"warns.log",level:"warn"}),
                new winston.transports.Console({level:"info"})
            ]
        })
    }else{
        return winston.createLogger({
            transports:[
                new winston.transports.Console({level:"info"})
            ]
        })
    }
}

//middleware utilizado para validar si se esta en modo administrador o no
export const authMiddleware = (req,res,next)=>{
    if(!req.auth) {        
        res.status(403).send({error:-2,message:"NO AUTORIZADO"})
        console.log(`Status ${res.statusMessage} en metodo ${req.method}, status code: ${res.statusCode} `)        
    } else next();
}

export const generate_dataProducts = () =>{
    let products = []
    let timestamp = Date.now();
    let time = new Date(timestamp);

    for (let i=0;i<5;i++){
        products.push({
            id:i+1,
            timestamp:time,
            title:faker.commerce.productName(),
            description:faker.name.title(),
            thumbnail:faker.image.food(200, 600, true),
            code:faker.finance.currencyName(),
            price:faker.commerce.price(),
            stock:faker.datatype.number({min: 1, max: 100}),

        })
    }
    return {status:"success",data:products};
}

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const isValidPassword = (user,password) => bcrypt.compareSync(password,user.data.password);

export default __dirname;