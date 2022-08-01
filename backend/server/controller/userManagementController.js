const UserModel = require("../model/userSchema");

const userDetails = async (req, res) => {
  if (req.authVerified.role === "admin") {
    try {
      const users = await UserModel.find({ interviewer: false });
      if (users.length !== 0) {
        res.status(200).send({ message: "Ok", users: users });
      } else {
        res.status(404).send({ message: "Not found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const updateBlockStatus = async (req, res) => {
  if (req.authVerified.role === "admin") {
    try {
      const user = await UserModel.findById(req.params.id);
      if (user) {
        const status = user.block;
        const updatedUser = await UserModel.updateOne(
          { _id: user._id },
          { block: !status }
        );
        const users = await UserModel.find({ interviewer: false });
        res.status(200).send({ message: "Ok", users: users });
      } else {
        res.status(404).send({ message: "User not found!" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const updateUserData = async (req, res) => {
  if (req.authVerified.role === "admin") {
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
        const users = await UserModel.find({ interviewer: false });
        res
          .status(200)
          .send({ message: "User Updated Successfully", user: users });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};
``;
const deleteUser = async (req, res) => {
  if (req.authVerified.role === "admin") {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      if (user) {
        const users = await UserModel.find({ interviewer: false });
        res.status(200).send({ message: "Ok", users: users });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

module.exports = { updateBlockStatus, userDetails, updateUserData, deleteUser };
