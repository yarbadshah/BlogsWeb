import express from 'express'
import { isAdmin, requireSingnIn } from './../middleware/authMiddleware.js';
import { UpdateCategoryController, createCategoryController, deleteCatogeryController, singleCategoryController } from '../controller/categoryController.js';
import { categoryController } from './../controller/categoryController.js';

const router = express.Router()

router.post(
    "/create-category",
    requireSingnIn,
    isAdmin,
    createCategoryController
  );
  router.put("/update-category/:id", requireSingnIn,isAdmin, UpdateCategoryController)
  router.get("/get-category", categoryController);
  router.get("/single-category/:slug", singleCategoryController);
  router.delete('/delete-category/:id', deleteCatogeryController)
 

export default router