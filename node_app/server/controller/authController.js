const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('./../../assets/js/catchAsync');
const AppError = require('./../../assets/js/appError');
const sendEmail = require('./../../assets/js/email');
const crypto = require('crypto');

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

exports.forgotPassword = catchAsync(async(req, res, next) => {
    //1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with this email', 404));
    }

    //2) Generate random token
    const resetToken = user.createPasswordResetToken();
    //just modified now save
    await user.save({ validateBeforeSave: false });

    //3) Send it back as email
    const resetURL = `${req.protocol}://${req.get('host')}/api/usersToBeAuth/resetPassword/${resetToken}`;

    const message = `Forgot your password? Create new one using: ${resetURL}.\n If this action is not done by you kindly ignore and report this back.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token valid for 10 mins',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email.'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });
        console.log(err);
        return next(new AppError('There was an error sending an email', 500));
    }

})
exports.resetPassword = catchAsync(async(req, res, next) => {
    //1) Get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    //2) If token has not expired, and user exists change or set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    //3) Update changedPasswordAt property for current user

    //4) Log the user in and send jwt token
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});