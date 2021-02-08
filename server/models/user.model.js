import mongoose from 'mongoose'
import crypto from 'crypto'

//----------------------------------------------------- Base Schema -----------------------------------------------------//
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
        required: 'Email is required'
    },
    hashed_password: {
        type: String,
        required: 'Password is required'
    },
    salt: String,
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    }
})

//----------------------------------------------------- Password Handling -----------------------------------------------------//
UserSchema.virtual('password')
    .set(function(password){
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() {
        return this._password
    })

UserSchema.path('hashed_password').validate(function(v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required.')
    }
}, null)

//----------------------------------------------------- Encryption -----------------------------------------------------//
UserSchema.methods = {
    //--------------------- Match provided pw with database hashed pw
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    //--------------------- Generate hashed pw from pw & salt via Node's crypto module
    encryptPassword: function(password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt) //'sha1' = type of hashing algorithm
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

export default mongoose.model('User', UserSchema)