const bcrypt = require('bcrypt');
const path = require('path');
const generateAccessToken = require('../utils/generate-access-token');
const Group = require('../models/group-permissions-model');
const User = require('../models/user.model');
// user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, groupName, restrictedPermissions = [], extraPermissions = [], status = 'INACTIVE' } = req.body;
    if (!name || !email || !password || !groupName) {
      return res.status(400).json(
        {
          message: 'Name, email, password and group are required.',
          status: 'fail'
        });
    }
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(409).json({
        message: 'User with this name or email already exists.',
        status: 'fail'
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const group = group = await Group.findOne({ name: groupName });
    if (!group) {
      return res.status(400).json({
        message: `Group '${groupName}' does not exist.`,
        status: 'fail'
      });
    }
    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      groups: [group._id],
      restrictedPermissions,
      status
    });

    await newUser.save();
    // Generate jwt access token 
    const accessToken = generateAccessToken({ userInfo: { id: newUser._id, email: newUser.email } });
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        groups: group ? [group.name] : [],
        status: newUser.status,
        accessToken
      },
      status: "success"
    });
  } catch (error) {
    console.error('Register user error:', error);
    return res.status(500).json({
      message: 'Server error, please try again later.',
      status: 'error'
    });
  }
};
const login = async (req, res, next) => {
  const { userName, email, password, role } = req.body;
  try {
    const existingUser = await userModel.findOne({ userName });
    if (!existingUser) {
      return next(new httpError('inCorrect username or password ', 401));
    }
    const isMatched = await existingUser.comparePassword(password)
    console.log(password, isMatched)
    if (!isMatched) {
      return next(new httpError('Wrong Password', 401))
    }
    const accessToken = await generateAccessToken(
      {
        userInfo: {
          userName: existingUser.userName,
          role: existingUser.role
        }
      }, next
    )
    await userModel.findByIdAndUpdate(
      existingUser._id,
      { refreshToken, isLoggedIn: true },
      { new: true })
    res.status(200).json({
      ...existingUser._doc,
      password: undefined,
      refreshToken: undefined,
      accessToken
    });

  } catch (error) {
    console.error(error);
    next(new httpError(error.message, 500))
  }
};

const updateUser = async (req, res, next) => {
  try {
    // Find and update user by ID
    const updatedUser = await userModel.findByIdAndUpdate(
      { _id: req.body.id },
      { ...req.body },
      { new: true }
    );

    // If no user is found, return an error message
    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // If update is successful, send a success response
    res.status(200).json({ message: 'User successfully updated', updatedUser });
  } catch (error) {
    // Catch any server error and log it
    console.log(error);
    res.status(500).json({ message: "Server error while updating user" });
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params
  console.log(id)
  try {
    const user = await userModel.findById(id)
    if (!user) return res.send("errror user not found")
    res.status(200).json(user)
  } catch (error) {
    res.send("errror on server")
    console.log(error)
  }
}
const getAllUser = async (req, res, next) => {
  try {
    const user = await userModel.find()
    if (!user) return res.send("errror user not found")
    res.status(200).json(user)
  } catch (error) {
    res.send("errror on server")
    console.log(error)
  }
}
const logout = async (req, res, next) => {
  const cookie = req.cookies
  if (!cookie) return next(new httpError('please login', 401))
  const refreshToken = cookie.Token

  try {
    const logoutUser = await userModel.findOne({ refreshToken })
    if (!logoutUser) return next(new httpError('please login', 401))
    await userModel.findByIdAndUpdate(logoutUser._id, { refreshToken: '', isLoggedIn: false }, { new: true })
    res.clearCookie('Token')
    res.status(200).json({ message: 'successfully logut' })
  } catch (error) {
    next(new httpError(error.message, 500))
  }
}

module.exports = {
  registerUser,
  updateUser,
  getUserById,
  getAllUser,
  login,
  logout
}
