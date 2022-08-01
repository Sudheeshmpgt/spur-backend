require("dotenv").config();
const AdminModel = require("../model/adminSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email != "" || password != "") {
      const admin = await AdminModel.findOne({ email: email });
      if (admin && admin.password) {
        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
          let token;
          token = jwt.sign(
            { _id: this._id, role: "admin" },
            process.env.SECRET_KEY
          );
          res.cookie("jwtoken", token, {
            expiresIn: "1h",
            httpOnly: true,
          });
          res.send({
            message: "Login Successfull",
            admin: admin,
            token: token,
          });
        } else {
          res.status(401).send({ message: "Inavalid Admin details" });
        }
      } else {
        res.status(401).send({ message: "User not registered" }); 
      }
    }else{
        res.status(401).send({ message: "Please Enter Email and Password" });
    }
  } catch (error) {
    res.send({ message: "Bad Request", err: error });
  }
};

const adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email: email });
    if (admin) {
      res.send({ message: "Admin already exists" });
    } else {
      const hashedPw = await bcrypt.hash(password, 12);
      const registerAdmin = new AdminModel({
        email: req.body.email,
        password: hashedPw,
      });
      const admin = await registerAdmin.save();
      res.send({ message: "Admin Registered Successfully", admin: admin });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { adminLogin, adminRegister };
