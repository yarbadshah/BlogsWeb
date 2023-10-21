import express from 'express'
import ExpressFormidable from 'express-formidable'
import { createProductController, getSingleProductController, productPhotoController, updateProductController, deleteProductController, productListController, getProductController } from './../controller/productController.js';
import { isAdmin, requireSingnIn } from './../middleware/authMiddleware.js';
const router = express.Router()
router.post('/create-product', requireSingnIn, isAdmin,ExpressFormidable(), createProductController)
router.put("/update-product/:pid", requireSingnIn, isAdmin,ExpressFormidable(), updateProductController)
router.get('/get-product',getProductController)
router.get('/get-product/:slug', getSingleProductController)
router.get('/product-photo/:pid',productPhotoController)
router.delete('/delete-product/:pid', deleteProductController)
router.get("/product-list/:page", productListController);
router.get('/product-photo/:pid',productPhotoController)


export default router