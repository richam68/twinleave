const httpStatus = require('http-status');
const catchAsync = require("../utils/catchAsync");
const AuthService = require("../services/auth.service");
const jwt = require("jsonwebtoken");

//generate JWT
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '30d'});
// }
const tokenTypes = {
    ACCESS: "access",
    REFRESH: "refresh",
    RESET_PASSWORD: "resetPassword",
  };

  const generateToken = (userId, expires, type, secret = process.env.JWT_SECRET) => {
    console.log("process.env.JWT_SECRET)", secret)
    const payload = {
      sub: userId,
      type: type,
      exp: expires,
      iat:Date.now()/1000,
    };
    const jwtToken = jwt.sign(payload, secret);
    return jwtToken;
  };
  
const generateAuthTokens = async (user) => {
    const expires = Math.floor(Date.now()/1000) + 240 * 60 ;
    const accessToken = generateToken(user._id, expires ,tokenTypes.ACCESS)
    return {  
        token:accessToken,
        expires:new Date(expires * 1000)
      }
  };
//Register User
const registerUser = catchAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const user = await AuthService.createUser({ username, email, password });
    res.status(httpStatus.CREATED).json({
        _id: user._id,
        username: user.username,
        email: user.email,
    });
});

//Login User
const loginUser = catchAsync(async (req, res) => {
    const {email, password } = req.body;
    const user = await AuthService.loginUser(email, password);
    const token = await generateAuthTokens(user);
    res.status(httpStatus.OK).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token
    })
})

const cart = catchAsync(async(req, res) => {
    const { productId, quantity } = req.body;

    try {
        const user = await AuthService.findById(req.user);
        const existingItem = user.cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ productId, quantity });
        }

        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

const viewCart = catchAsync(async (req, res) => {
    try {
        const user = await AuthService.findById(req.user);
        res.json(user.cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const makeOrder = catchAsync(async (req, res) => {
    try {
        const user = await AuthService.findById(req.user);
        user.cart = [];  // Empty the cart after placing the order
        await user.save();
        res.json({ message: 'Order placed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

module.exports = {
    registerUser,
    loginUser,
    cart,
    viewCart,
    makeOrder
}

