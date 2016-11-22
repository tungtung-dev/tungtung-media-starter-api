/**
 * Created by Tien Nguyen on 9/30/16.
 */

import mongoose from "mongoose";

var {Schema} = mongoose;

var passwordSchema = new Schema({
    email: String,
    token: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

passwordSchema.virtual('id').get(function () {
    return this._id;
});

passwordSchema.set('toJSON', {virtuals: true});

export default mongoose.model('password', passwordSchema);
