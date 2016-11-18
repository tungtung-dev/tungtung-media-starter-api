/*
 * Created by Tien Nguyen on 6/25/16.
 */

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var TagSchema = new Schema({
    tag_name: String,
    slug: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

TagSchema.virtual('id').get(function () {
    return this._id;
});

TagSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('tag', TagSchema);
