/**
 * Created by Tien Nguyen on 11/11/16.
 */
import mongoose from "mongoose";

var {Schema} = mongoose;

var menuSchema = new Schema({
    name: String,
    key: String,
    description: String,
    data: {},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

menuSchema.virtual('id').get(function () {
    return this._id;
});

menuSchema.set('toJSON', {virtuals: true});

export default mongoose.model('menu', menuSchema);
