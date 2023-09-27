import mongoose from "mongoose";
import { productModel } from "../models/product.model.js";

class ProductManager {
    async addProduct(product) {
        try {
            if (await this.validateCode(product.code)) {
              console.log("Error: el codigo ya existe");
              return false;
            } else {
              const producto = {
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: product.status,
                stock: product.stock,
                category: product.category,
                thumbnails: product.thumbnails,
              };
              const createdProduct = await productModel.create(producto);
              console.log("producto agregado!");
              return createdProduct;
            }
          } catch (error) {
            console.error("Error adding product:", error);
            return false;
          }
        }

    async updateProduct(id, product) {
        try {
            if (this.validateId(id)) {   
                if (await this.getProductById(id)) {
                    await productModel.updateOne({_id:id}, product);
                    console.log("Product updated!");
        
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.log("Not found!");
    
            return false;
        }
    }

    async deleteProduct(id) {
        try {
            if (this.validateId(id)) {    
                if (await this.getProductById(id)) {
                    await productModel.deleteOne({_id:id});
                    console.log("Product deleted!");
    
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.log("Not found!");
    
            return false;
        }
    }

    async getProducts(params = {}) {
        let { limit = 10, page = 1, query = {}, sort = {} } = params;
        console.log("Query object:", query, "Type:", typeof query);

        sort = sort ? (sort === "asc" ? { price: 1 } : { price: -1 }) : {};

        try {
          console.log('Received params:', params); 
          console.log('Type of query:', typeof params.query);  
          let products = await productModel.paginate(query, {
            limit: limit,
            page: page,
            sort: sort,
            lean: true,
          });
          let status = products ? "success" : "error";
          let prevLink = products.hasPrevPage
            ? "http://localhost:8000/products?limit=" +
              limit +
              "&page=" +
              products.prevPage
            : null;
          let nextLink = products.hasNextPage
            ? "http://localhost:8000/products?limit=" +
              limit +
              "&page=" +
              products.nextPage
            : null;

          products = {
            status: status,
            payload: products.docs,
            totalPages:products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
          };

          console.log(products);
          return products;
        } catch (error) {
          console.error("Error fetching products:", error);
          return {
            status: "error",
            payload: [],
            };
        }
    }  


        //return await limit ? productModel.find().limit(limit).lean() : productModel.find().lean();
        //let {limit, page, query, sort} = params;
        //limit = limit ? limit : 10;
        //page = page ? page : 1;
        //query = query || {};
        //sort = sort ? sort == "asc" ? 1 : -1 : 0;
        //let products = await productModel.paginate(query, {limit:limit, page:page, sort:{price:sort}});
        //let status = products ? "success" : "error";
//
        //let prevLink = products.hasPrevPage ? "http://localhost:8080/products?limit=" + limit + "&page=" + products.prevPage : null;
        //let nextLink = products.hasNextPage ? "http://localhost:8080/products?limit=" + limit + "&page=" + products.nextPage : null;
        //
        //products = {status:status, payload:products.docs, totalPages:products.totalPages, prevPage:products.prevPage, nextPage:products.nextPage, page:products.page, hasPrevPage:products.hasPrevPage, hasNextPage:products.hasNextPage, prevLink:prevLink, nextLink:nextLink};
//
        //return products;
    //}

    async getProductById(id) {
        if (this.validateId(id)) {
            return await productModel.findOne({_id:id}).lean() || null;
        } else {
            console.log("Producto no encontrado");
            
            return null;
        }
    }

    validateId(id) {
        return id.length === 24 ? true : false;
    }

    async validateCode(code) {
        return await productModel.findOne({code:code}) || false;
    }

}

export default ProductManager;