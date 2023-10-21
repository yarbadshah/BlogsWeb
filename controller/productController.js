import slugify from "slugify"
import productModel from "../models/productModel.js"
import categoryModel from "../models/categoryModel.js";
import fs from 'fs'
import dotenv from "dotenv";


dotenv.config();

//payment gateway

export const createProductController = async (req, res) => {
    try {
      const { name, description, price, category, quantity, shipping } =
        req.fields;
      const { photo } = req.files;
      //alidation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
       
        case photo && photo.size > 1000000:
          return res
            .status(500)
            .send({ error: "photo is Required and should be less then 1mb" });
      }
  
      const products = new productModel({ ...req.fields, slug: slugify(name) });
      if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      await products.save();
      res.status(201).send({
        success: true,
        message: "Product Created Successfully",
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in crearing product",
      });
    }
  };

export const getProductController = async(req,res)=>{
  try{
    const products = await productModel.find({}).populate('category').select('-photo').limit(12).sort({createAt:-1})
    res.status(200).send({
      success:true,
      countTotal : products.length,
      message:"All product",
      products
    })
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:"Error in Get in All Data"
    })
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};
export const productPhotoController = async(req,res) =>{
  try{
    const product = await productModel.findById(req.params.pid).select('photo');
    if(product.photo.data){
      res.set('Content-type', product.photo.contentType)
      return res.status(200).send(product.photo.data)
    }
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Error while geting Photo",
      error
    })
  }
};

export const deleteProductController = async(req,res)=>{
  try{
    await productModel.findByIdAndDelete(req.params.pid).select("-photo")
    res.status(200).send({
      success:true,
      message:"Delete Product Successfuly"
    })
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Error in Delete the product"
    })
  }
};
export const updateProductController = async (req, res) => {
  try {
    const { name, description, category } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
     
      case !category:
        return res.status(500).send({ error: "Category is Required" });
  
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};
