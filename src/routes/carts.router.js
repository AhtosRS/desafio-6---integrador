import { Router } from "express";
import cartControllers from "../controllers/cartControllers.js";

const cartsRouter = Router();


cartsRouter.post("/", cartControllers.createCart.bind(cartControllers));

cartsRouter.get("/:cid", cartControllers.getCart.bind(cartControllers));

cartsRouter.post("/:cid/products/:pid", cartControllers.addProductToCart.bind(cartControllers));

cartsRouter.put("/:cid/products/:pid", cartControllers.updateQuantityProductFromCart.bind(cartControllers));

cartsRouter.put("/:cid", cartControllers.updateCart.bind(cartControllers));

cartsRouter.delete("/:cid/products/:pid", cartControllers.deleteProductFromCart.bind(cartControllers));

cartsRouter.delete("/:cid", cartControllers.deleteProductsFromCart.bind(cartControllers));
export default cartsRouter;