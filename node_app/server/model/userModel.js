const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please tell us you email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter valid email.']
    },
    photo: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A user must have a strong password!'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your passwords'],
        validate: {
            //this will work in only in CREATE and SAVE!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password are not same'
        }
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    //hashing algo bcrypt--> protection against brute force
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
});

//instance method available to all user documents
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;