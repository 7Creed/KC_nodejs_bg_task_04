const { userCollection } = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { v4: uuidv4 } = require("uuid");
const { v4 } = require("uuid");
const { sendEmail } = require("../utils/emailUtils");
const { userTokenCollection } = require("../model/userToken");
const { request } = require("express");

const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).send({
      message: "Full name, email, and password are required.",
    });
  }

  const existingUser = await userCollection.findOne({ email });
  if (existingUser) {
    return res.status(400).send({
      message: "User already exists",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  // const token = uuidv4();
  const token = v4();

  await userCollection.create({
    fullName: fullName,
    email: email,
    password: hashedPassword,
    token,
    pururpose: "verification",
  });

  res.status(201).send({
    isSuccessful: true,
    message: "User created successfully",
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userCollection.findOne({ email });

  if (!user) {
    return res.status(404).send({
      isSuccessful: false,
      message: "User does not exist",
    });
  }

  const doPasswordMatch = bcrypt.compareSync(password, user.password);

  if (!doPasswordMatch) {
    return res.status(401).send({
      isSuccessful: false,
      message: "incorrect password",
    });
  }

  const userToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.AUTH_KEY
  );

  res.status(200).send({
    isSuccessful: true,
    user: {
      fullName: user.fullName,
    },
    userToken,
    message: "Logged in successfully",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({
      message: "Email is required",
    });
  }

  try {
    const user = await userCollection.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const token = v4();

    // await userTokenCollection.create({
    //   userId: user._id,
    //   token,
    // });
    await userTokenCollection({
      userId: user._id,
      token,
    }).save();

    await sendEmail(user.email, "Password Reset", token);

    res.status(200).send({
      isSuccessful: true,
      // user: {
      //   fullName: user.fullName,
      //   userId: user._id,
      //   uniqueId: token,
      // },
      message: "Check your email to change password",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).send({
      message: "Server error",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).send({
      message: "Input new password",
    });
  }

  console.log(token);

  try {
    const validToken = await userTokenCollection.findOne({ token });

    if (!validToken) {
      res.status(404).send({
        message: "Invalid or expired token",
      });
      return;
    }

    const user = await userCollection.findById(validToken.userId);

    if (!user) {
      res.status(404).send({
        message: "User not found",
      });
      return;
    }
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();

    await validToken.deleteOne({ _id: validToken._id });

    res.status(200).send({
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("Error in reset password:", err);
    res.status(500).send({
      message: "Server error",
    });
  }
};

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  // console.log(req.header);
  // console.log(token);

  if (!token) {
    res.status(401).send({
      isSuccessful: false,
      message: "Access Denied.",
    });
    return;
  }

  try {
    const decode = jwt.verify(token, process.env.AUTH_KEY);
    console.log(decode);
    req.user = await userCollection.findById(decode.userId);
    next();
  } catch (err) {
    res.status(401).send({
      isSuccessful: false,
      message: "Invalid token",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      res.status(404).send({
        isSuccessful: false,
        message: "User not found",
      });
      return;
    }

    res.send({
      isSuccessful: true,
      userDetails: {
        userId: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
      },
    });
  } catch (err) {
    res.status(500).send({
      isSuccessful: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  authenticateUser,
  getProfile,
};

// function example(val1, val2) {
//   let x = 2;
//   function red(x) {
//     return val1 + val2 + x
//   }
// }
