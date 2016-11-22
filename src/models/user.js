/**
 * Created by Tien Nguyen on 8/20/16.
 */
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    avatar: String,
    username: String,
    password: String,
    fullName: String,
    birthday: String,
    gender: String,
    nickname: String,
    biography: String,
    facebook: String,
    admin: Boolean
});

userSchema.virtual('id').get(function () {
    return this._id;
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('user', userSchema);
