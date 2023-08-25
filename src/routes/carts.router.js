import CartManager from "../dao/CartManager.js";
import ProductManager from "../dao/ProductManager.js";
import { Router } from "express";

const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
	try {
		const cart = new CartManager();
		

		const addProduct = await cart.newCart();
		res.status(200).send(addProduct);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

//lo agregue unicamente para que no tire error en la principal del get
cartsRouter.get("/", async (req, res) => {
	try {
		const cart = new CartManager();
		
		const getCart = await cart.getCarts();
		res.status(200).send(getCart);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

cartsRouter.get("/:cid", async (req, res) => {
	const { cid } = req.params;
	try {
		if (!cid) {
			return res.status(400).send({ error: "id is not a number" });
		}

		const cart = new CartManager();
		

		const getOrderById = await cart.getCart(cid);

		if (!getOrderById) {
			return res.status(404).send({ error: "cart not found" });
		}

		res.status(200).send({ cart: getOrderById });
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
	try {
		const cart = new CartManager();
		const productManager = new ProductManager();
		const { cid, pid } = req.params;
		

		const getOrderById = await cart.getCart(cid);
		if (!getOrderById) {
			return res.status(404).send({ error: "cart not found" });
		}

		const getProductById = await productManager.getProductById(pid);
		if (!getProductById) {
			return res.status(404).send({ error: "product not found" });
		}

		await cart.addProductToCart(cid, pid);

		res.status(200).send({ message: "product added to cart", product: getProductById });
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

export default cartsRouter;

