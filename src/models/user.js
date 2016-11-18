/**
 * Created by Tien Nguyen on 8/20/16.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: String,
    avatar: String,
    username: String,
    password: String,
    full_name: String,
    birthday: String,
    gender: String,
    nickname: String,
    biography: String,
    facebook: String,
    admin: Boolean
});

UserSchema.virtual('id').get(function () {
    return this._id;
});

UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('user', UserSchema);
