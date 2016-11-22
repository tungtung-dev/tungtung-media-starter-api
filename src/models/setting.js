/**
 * Created by Tien Nguyen on 11/11/16.
 */
import mongoose from "mongoose";

var {Schema} = mongoose;

var settingSchema = new Schema({
    key: String,
    value: {},
    isPrivate: Boolean,
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

settingSchema.virtual('id').get(function () {
    return this._id;
});

settingSchema.set('toJSON', {virtuals: true});

export default mongoose.model('setting', settingSchema);
