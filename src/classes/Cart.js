import fs from 'fs'

class Cart{    
    constructor(fileName){
        this.fileName=fileName
    }
    
    // crea un carrito y devuelve el id del carrito
    async createCart(){         
        try{
            let data =await fs.promises.readFile(this.fileName,'utf-8');
            let newCart=JSON.parse(data);           
            let nuevoId = newCart[newCart.length-1].id+1;            
            if (newCart.some(res=>res.id===nuevoId)){ 
                return {status:"error",message:"Carrito existente"}
            }else{
                let timestamp = Date.now();
                let time = new Date(timestamp);
                let cart = {
                    id:nuevoId,
                    timestamp:time,
                    products:[]
                }                                
                newCart.push(cart);
                try{
                    await fs.promises.writeFile(this.fileName,JSON.stringify(newCart,null,2));                                        
                    return {status:"success",message:"Carrito creado",id:cart.id}

                }catch(err){
                    return {status:"error",message:"No se pudo crear el carrito"}
                }
            }             
        }catch{             
            let timestamp = Date.now();
            let time = new Date(timestamp);
            let cart = {
                id:1,
                timestamp:time,
                products:[]                
            }    
            try {
                await fs.promises.writeFile(this.fileName,JSON.stringify([cart]),null,2) 
                return {status:"success",message:"carrito creado",id:cart.id}
            }catch(err){
                return {status:"error",message:"No se pudo crear el archivo"}
            }
        }
    }
    
    //devuelve todos los productos del carrito elegido
    async getProducts(numberId){
        try{            
            let data = await fs.promises.readFile(this.fileName,'utf-8');            
            let cartProducts = JSON.parse(data);            
            let prod = cartProducts.find(prod=>prod.id===numberId);            
            if (prod){
                return {status:"success",data:prod}
            }else{
                return {status:"error",message:"Producto no encontrado"}           
            }            
        }catch(err){
            return {status:"error",message:err}
        }
    }

    //muestra todos los carritos y sus productos
    async getAllCart(){
        try{
            let data = await fs.promises.readFile(this.fileName,'utf-8');
            let newCartArray = JSON.parse(data);            
            if (newCartArray){
                return {status:"success",data:newCartArray}
            }else{
                return {status:"error",message:"No se encontraron carritos de compra"}           
            }            
        }catch(err){
            return {status:"error", message:err}
        }
    }

    //agrega un producto (solo id) al carrito elegido
    async addProductToCart(cartId,productId){        
        try{
            let data = await fs.promises.readFile(this.fileName,'utf-8');
            let newCartArray = JSON.parse(data); 
            if(!newCartArray.some(cart=>cart.id===cartId)) return {status:"error", message:"No hay carrito con id elegido"}
            let result = newCartArray.map(cart=>{                
                if(cart.id===cartId){     
                    let cartProduct = cart                   
                    cartProduct = Object.assign(cartProduct,{timestamp:cartProduct.timestamp,products:[...cartProduct.products,productId]})                    
                    cartProduct = Object.assign({...cartProduct,id:cart.id})                    
                    return cartProduct                    
                }else{                                 
                    return cart;
                }
            })
            try{
                await fs.promises.writeFile(this.fileName,JSON.stringify(result,null,2));
                return {status:"success", message:"Carrito actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar el carrito"}
            }
        }catch(err){
            return {status:"error",message:"Fallo al agregar un producto al carrito"}
        }
    }

    //borra producto de un carrito
    async delProductById(cartId,productId){
        try{
            let data = await fs.promises.readFile(this.fileName,'utf-8');
            let carts = JSON.parse(data);  
            let result = carts.map(cart=>{               
                if(cart.id===cartId && cart.products.length>0){     
                    let cartProduct = cart     
                    let itemfind = cart.products.filter((p=>p!=productId))
                    cartProduct = Object.assign(cartProduct,{timestamp:cartProduct.timestamp,products:itemfind})                    
                    cartProduct = Object.assign({...cartProduct,id:cart.id})                    
                    return cartProduct                    
                }else{
                    return {status:"error", message:"Error al eliminar producto del carrito"}                                 
                    
                }                     
                })
            try{
                await fs.promises.writeFile(this.fileName,JSON.stringify(result,null,2));
                return {status:"success", message:"Producto eliminado del carrito"}
            }catch{
                return {status:"error", message:"Error al eliminar producto del carrito"}
            }
                  
        }catch(err){
            return {status:"error",message:err}
        }
    }

    
    //borra un carrito por su id
    async deleteCartbyId(numberId){
        try{
            let newCart = JSON.parse(data); 
            let data = await fs.promises.readFile(this.fileName,'utf-8');
            let cart = newCart.find(res=>res.id===numberId);
            if (cart){
                let newCartUpdate = newCart.filter((p)=>p.id!=numberId)                           
                await fs.promises.writeFile(this.fileName,JSON.stringify(newCartUpdate),null,2)                 
                return {status:"success",message:"Se eliminó el carrito elegido"} 
            }else{
                return {status:"error",message:"No había carrito para eliminar"}           
            }         
        }catch(err){
            return {status:"error",message:err}
        }
    }
    
    //borra todos los carritos
    async deleteAll(){
        try{
            await fs.promises.writeFile(this.fileName,JSON.stringify(''),null,2);
            return {status:"success",message:"Todos los carritos fueron eliminados"}         
        }catch(err){
            return {status:"error",message:err}
        }
    }
}

export default Cart