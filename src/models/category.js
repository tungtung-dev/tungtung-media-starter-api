/**
 * Created by Tien Nguyen on 9/30/16.
 */

import mongoose from "mongoose";

var {Schema} = mongoose;

var CategorySchema = new Schema({
    value: String,
    text: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

CategorySchema.virtual('id').get(function () {
    return this._id;
});

CategorySchema.set('toJSON', {virtuals: true});

export default mongoose.model('category', CategorySchema);
