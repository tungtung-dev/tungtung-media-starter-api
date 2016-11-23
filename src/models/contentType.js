/**
 * Created by Tien Nguyen on 11/23/16.
 */
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var contentTypeSchema = new Schema({
    label: {type: String},
    model: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

contentTypeSchema.virtual('id').get(function () {
    return this._id;
});

contentTypeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('content_type', contentTypeSchema);
