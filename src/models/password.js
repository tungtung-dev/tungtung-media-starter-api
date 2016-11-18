/**
 * Created by Tien Nguyen on 9/30/16.
 */

import mongoose from "mongoose";

var {Schema} = mongoose;

var PasswordSchema = new Schema({
    email: String,
    token: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

PasswordSchema.virtual('id').get(function () {
    return this._id;
});

PasswordSchema.set('toJSON', {virtuals: true});

export default mongoose.model('password', PasswordSchema);
