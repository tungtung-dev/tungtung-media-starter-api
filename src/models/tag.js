/*
 * Created by Tien Nguyen on 6/25/16.
 */

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    tagName: String,
    slug: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

tagSchema.virtual('id').get(function () {
    return this._id;
});

tagSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('tag', tagSchema);
