import express from 'express';
import __dirname from './utils.js';
import Handlebars from "handlebars";
import expressHandlebars  from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import {Server} from 'socket.io';
import { router } from './routes/users.router.js';
import mongoose from 'mongoose';

import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import ProductManager from "./dao/ProductManager.js";
import productsRouter from "./routes/products.router.js";

import CartManager from "./dao/CartManager.js";
import cartsRouter from "./routes/carts.router.js";

import ChatManager from './dao/ChatManager.js';
import chatRouter from './routes/chat.router.js';

import sessionsRouter from "../src/routes/session.router.js"
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();
const httpServer = app.listen(8080, ()=> console.log("Listening on port 8080"));

const io = new Server(httpServer);

app.use(express.json());

//plantillas
//app.engine('handlebars', handlebars.engine());
app.engine(
	"handlebars",
	expressHandlebars.engine({
	  handlebars: allowInsecurePrototypeAccess(Handlebars),
	})
  );
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+ '/public'));
app.use('/', viewsRouter);
app.use(express.urlencoded({ extended: true }));
app.use(session({
	secret: 'M5E7',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false },
	store: MongoStore.create({ 
	  mongoUrl: "mongodb+srv://coder:Coder123@cluster0.n4jwzj5.mongodb.net/Ecommerce?retryWrites=true&w=majority",
	  collectionName: 'sessions'
	})
  }));

const productManager = new ProductManager();
const cartsManager = new CartManager();
const chatManager = new ChatManager();

let messages =[]; //los mensajes del chatbox se guardan aca

io.on('connection', async(socket)=>{
    console.log("nuevo cliente conectado")

    //chatbox
    socket.on("message",data=>{ //escucha el evento "message" del cliente
        messages.push(data) //guarda el objeto en el arrray
        io.emit('messageLogs', messages) //reenvia el log actualizado al evento "messageLogs@ en el index.js
    })

    //productos
    const listProducts = await productManager.getProducts();
    io.emit("sendProducts", listProducts);
    socket.on("nuevoProducto", async (product) => {    //addProduct
		try {
			await productManager.initialize();
			const exist = await productManager.getProducts();

			if (exist.some((item) => item.code === product.code)) {
				return socket.emit("error", { error: "El código ya existe" });
			}

			await productManager.addProduct(product);

			const listProducts = await productManager.getProducts();
			socketServer.emit("sendProducts", listProducts);
		} catch (err) {
			socket.emit("error", { error: err.message });
		}
	});
	socket.on("eliminarProducto", async (id) => {  //deleteProduct
		try {
			await productManager.initialize();
			const exist = await productManager.getProductsById(id);
			if (!exist) {
				return socket.emit("error", { error: "El producto no existe" });
			}
			await productManager.deleteProduct(id);
			const listProducts = await productManager.getProducts();
			socketServer.emit("productosupdated", listProducts);
		} catch (err) {
			socket.emit("error", { error: err.message });
		}
	});

    //carts
    const listCarts = await cartsManager.getCarts();
    io.emit("sendCarts", listCarts);

    //chats
    const listChat = await chatManager.getMessages();
    io.emit("sendChats", listChat);
})



app.use('/api/users', router);
app.use('/api/products/', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/chats', chatRouter);
app.use("/api/sessions/", sessionsRouter);
app.use("/", viewsRouter);

//conexion a mongo atlas
mongoose.connect("mongodb+srv://coder:Coder123@cluster0.n4jwzj5.mongodb.net/Ecommerce?retryWrites=true&w=majority");
