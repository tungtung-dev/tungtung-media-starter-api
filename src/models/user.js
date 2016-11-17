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
    fullname: String,
    birthday: String,
    gender: String,
    nickname: String,
    biography: String,
    facebook: String,
    followed_users: [{type: Schema.ObjectId, ref: 'user'}],
    followed_tags: [{type: Schema.ObjectId, ref: 'tag'}],
    admin: Boolean
});

UserSchema.virtual('id').get(function () {
    return this._id;
});

UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('user', UserSchema);
