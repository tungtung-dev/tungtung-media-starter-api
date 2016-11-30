/**
 * Created by Tien Nguyen on 9/30/16.
 */

import mongoose from "mongoose";

var {Schema} = mongoose;

var categorySchema = new Schema({
    name: {type: String},
    slug: {type: String},
    index: {type: String},
    icon: {type: String},
    featuredImage: {},
    secondaryFeaturedImage: {},
    customField: {},
    parent: {type: Schema.ObjectId, ref: 'category'},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

categorySchema.virtual('id').get(function () {
    return this._id;
});

categorySchema.set('toJSON', {virtuals: true});

export default mongoose.model('category', categorySchema);
