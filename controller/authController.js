import userModels from '../models/userModels.js';
import { comparePassword, hashPassword} from '../helpers/authHelpers.js'
import JWT from 'jsonwebtoken'

export const registerController = async(req,res) =>{
    try {
        const { name, email, password, phone, address} = req.body;
        //validations
        if (!name) {
          return res.send({ error: "Name is Required" });
        }
        if (!email) {
          return res.send({ message: "Email is Required" });
        }
        if (!password) {
          return res.send({ message: "Password is Required" });
        }
        if (!phone) {
          return res.send({ message: "Phone no is Required" });
        }
        if (!address) {
          return res.send({ message: "Address is Required" });
        }
       
        //check user
        const exisitingUser = await userModels.findOne({ email });
        //exisiting user
        if (exisitingUser) {
          return res.status(200).send({
            success: false,
            message: "Already Register please login",
          });
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModels({
          name,
          email,
          phone,
          address,
          password: hashedPassword,
         
        }).save();
    
        res.status(201).send({
          success: true,
          message: "User Register Successfully",
          user,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Errro in Registeration",
          error,
        });
      }
}
export const loginController = async (req,res)=>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(404).send({
                success:"false",
                message:"Invalid email or password"
            })
        }
        const user = await userModels.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is Not Register"
            })
        }
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"invalid Password"
            })
        }
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'})
        res.status(200).send({
            success:true,
            message:"Login successfully",
            user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role: user.role, 
          },
          token,
           
        }); 
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Login",
            error
        })
    }
  }
  export const testController = (req, res) => {
    res.send('protect route');
  }
  export const forgotPasswordController = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      if (!email) {
        res.status(400).send({ message: "Emai is required" });
      }
      if (!newPassword) {
        res.status(400).send({ message: "New Password is required" });
      }
      //check
      const user = await userModels.findOne({ email});
      //validation
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Wrong Email Or Answer",
        });
      }
      const hashed = await hashPassword(newPassword);
      await userModels.findByIdAndUpdate(user._id, { password: hashed });
      res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  };

  export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };