const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('./../../assets/js/catchAsync');
const AppError = require('./../../assets/js/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    //1)email and passwords exists
    if (!email || !password) {
        return next(new AppError('Please provide email and Passwords!', 400))
    }

    //2)user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }
    //3)ok then send the token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});

exports.protect = catchAsync(async(req, res, next) => {
    //1) Getting the token and check if its exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in, please login to get access', 401));
    }
    //2) Verification of token
    //to make this return promise using promisify
    let verified
    try {
        verified = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        console.log(verified)
    } catch (err) {
        return next(new AppError('Invalid Token or Expired. Please login again', 401));
    }

    //3) User still exists or not
    const freshUser = await User.findById(verified.id);
    if (!freshUser) {
        return next(new AppError('User belonging to token does not exists', 401));
    }

    //4) Check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(verified.iat)) {
        return next(new AppError('Recently changed password! Please login again.', 401));
    }

    //Grant Access to protected route'
    req.user = freshUser;
    next();
});