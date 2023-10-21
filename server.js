import express from "express";
import dotenv from 'dotenv'
import connectDB from "./config/db.js";
import authoRoutes from './routes/authRoute.js'
import CategoryRoutes from './routes/categoryRoutes.js'
import productRoutes from "./routes/productRoutes.js";
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from "url";
const app = express()

dotenv.config()

connectDB()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.json())

app.use(cors())
app.use('/api/v1/auth',authoRoutes)

app.use('/api/v1/category', CategoryRoutes)
app.use("/api/v1/product", productRoutes);
app.use(express.static(path.join(__dirname,'./client/build')))

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
const PORT=process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Server runing at ${PORT}`)
})
