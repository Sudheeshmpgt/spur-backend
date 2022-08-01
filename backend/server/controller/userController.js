require("dotenv").config();
const UserModel = require("../model/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const SERVICESID = process.env.SERVICE_ID;
const AccountSID = process.env.ACCOUNT_SID;
const AuthToken = process.env.AUTH_TOKEN;
const client = require("twilio")(AccountSID, AuthToken);

const registration = async (req, res) => {
  try {
    const { name, phone, email, password, interviewer } = req.body;
    if (interviewer) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        res.send({ message: "User already exists" });
      } else {
        const hashedPw = await bcrypt.hash(password, 12);
        const registerUser = new UserModel({
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
          password: hashedPw,
          interviewer: interviewer,
          experience: req.body.experience,
        });
        const user = await registerUser.save();
        res.send({
          message: "Interviewer registration successfull",
          user: user,
        });
      }
    } else {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        res.send({ message: "User already exists" });
      } else {
        const hashedPw = await bcrypt.hash(password, 12);
        const registerUser = new UserModel({
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
          password: hashedPw,
          interviewer: interviewer,
        });
        const user = await registerUser.save();
        res.send({ message: "User Registered Successfully", user: user });
      }
    }
  } catch (error) {
    res.send(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      const interviewer = user.interviewer;
      if (isMatch) {
        let token;
        if (interviewer) {
          token = jwt.sign(
            { _id: this._id, role: "interviewer" },
            process.env.SECRET_KEY
          );
        } else {
          token = jwt.sign(
            { _id: this._id, role: "user" },
            process.env.SECRET_KEY
          );
        }
        res.cookie("jwtoken", token, {
          expiresIn: "1h",
          httpOnly: true,
        });
        res.send({ message: "Login Successfull", user: user, token: token });
      } else {
        res.send({ message: "Invalid login details" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  } catch (error) {
    res.status(500).send({ message: "Invalid Credentials", err: error }); 
  }
};

const otpLogin = async (req, res) => {
  try {
    client.verify
      .services(SERVICESID)
      .verifications.create({
        to: `+91${req.body.phone}`,
        channel: "sms",
      })
      .then((resp) => {
        res.status(200).send({ data: resp });
      });
  } catch (error) {
    res.send(error);
  }
};

const otpVerify = async (req, res) => {
  try {
    const { otp, phone } = req.body;
    client.verify
      .services(SERVICESID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp,
      })
      .then((resp) => {
        (async () => {
          if (resp.valid) {
            const user = await UserModel.findOne({ phone: phone });
            if (user) {
              const interviewer = user.interviewer;
              let token;
              if (interviewer) {
                token = jwt.sign(
                  { _id: this._id, role: "interviewer" },
                  process.env.SECRET_KEY
                );
              } else {
                token = jwt.sign(
                  { _id: this._id, role: "user" },
                  process.env.SECRET_KEY
                );
              }
              res.cookie("jwtoken", token, {
                expiresIn: "1h",
                httpOnly: true,
              });
              res.send({
                message: "Login Successfull",
                user: user,
                token: token,
              });
            }
          } else {
            res.send({ message: "User not registered" });
          }
        })();
      });
  } catch (error) {
    res.send(error);
  }
};

const updateUserData = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.email = req.body.email || user.email;
      user.about = req.body.about || user.about;
      user.experience = req.body.experience || user.experience;
      user.profileImg = req.file ? req.file.path : "" || user.profileImg;

      const updatedUser = await user.save();
      res.send({ message: "User Updated Successfully", user: updatedUser });
    } else {
      res.send({ message: "Request failed" });
    }
  } catch (error) {
    res.status(500).send({ message: "Bad request", err: error });
  }
};

const getUserData = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      res.send({ message: "Successful", user: user });
    } else {
      res.send({ message: "Error" });
    }
  } catch (error) {
    res.send({ message: "Bad request", err: error });
  }
};

const addConnection = async (req, res) => {
  try {
    const { userId, connectionId } = req.body;
    const user = await UserModel.findById(userId);
    const checkSelf = userId === connectionId;
    if (user && !checkSelf) {
      const check = user.connections.includes(connectionId);
      if (check) {
        res.send({ message: "Connection already exists" });
      } else {
        const conn = await UserModel.updateOne(
          { _id: userId },
          { $push: { connections: connectionId } }
        );
        res.send({ message: "Connection added successfully" });
      }
    } else {
      res.send({ message: "Request failed" });
    }
  } catch (error) {
    res.status(500).send({ message: "Bad request", err: error });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPw = await bcrypt.hash(password, 12);
    const filter = {
      email: email,
    };
    const values = {
      password: hashedPw,
    };
    const data = await UserModel.findOneAndUpdate(filter, values);
    if (data.length == 0) {
      res.send({ error: "Please try again" });
    } else {
      res.send({ message: "Password updated successfully" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  registration,
  login,
  otpLogin,
  otpVerify,
  updateUserData,
  getUserData,
  addConnection,
  changePassword,
};
