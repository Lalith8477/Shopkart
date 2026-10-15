import Customer from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { genToken } from "../utils/generateToken.js"

const cookieOption = {
  httpOnly: true
};

export const registerCustomer = async(req, res) => {
    try{
        const {fullName, email, password, phone} = req.body
        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields Required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password Length must be greater than 6" })
        }

        const emailExists = await Customer.findOne({ email })
        if (emailExists) {
            return res.status(409).json({ message: "User Already Exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newCustomer = await Customer.create({
            fullName,
            email,
            password : hashedPassword,
            phone
        })
        const customer = await Customer.findById(newCustomer._id).select("-password")

        res.status(201).json({ 
            success : true, 
            message: "Customer registered successfully", 
            customer : customer })

    }catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err })
    }
}


export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body
        
        const customer = await Customer.findOne({ email })

        if (!customer) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const passwordCheck = await bcrypt.compare(password, customer.password)

        if (!passwordCheck) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const token = genToken(customer._id);
        res.cookie("token", token, cookieOption);

        res.status(200).json({ message: "User Logged In" })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}


export const getMyProfile = async (req, res) => {
    res.status(200).json({ message: "User Authenticated", customerProfile : req.customer })
}

export const logoutCustomer = async (req, res) => {
  res.clearCookie("token");

  res.status(200).json({message: "User Logout"});
};