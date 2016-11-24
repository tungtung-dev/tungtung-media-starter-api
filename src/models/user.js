/**
 * Created by Tien Nguyen on 8/20/16.
 */
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String},
    avatar: {type: String},
    username: {type: String},
    password: {type: String},
    fullName: {type: String},
    birthday: {type: String},
    gender: {type: String},
    nickname: {type: String},
    biography: {type: String},
    facebook: {type: String},
    superAdmin: {type: Boolean, default: false},
    permissions: {type: [Schema.ObjectId], ref: 'permission'}
});

userSchema.virtual('id').get(function () {
    return this._id;
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('user', userSchema);
