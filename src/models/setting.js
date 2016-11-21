/**
 * Created by Tien Nguyen on 11/11/16.
 */
import mongoose from "mongoose";

var {Schema} = mongoose;

var SettingSchema = new Schema({
    key: String,
    value: {},
    is_private: Boolean,
    created_at: {type: Date},
    updated_at: {type: Date}
});

SettingSchema.virtual('id').get(function () {
    return this._id;
});

SettingSchema.set('toJSON', {virtuals: true});

export default mongoose.model('setting', SettingSchema);
