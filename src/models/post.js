import mongoose from 'mongoose';
import {postState} from "../utils/constants";
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true},
    searchField: {type: String, required: true},
    description: {type: String},
    content: {},
    state: {type: String, default: postState.DRAFT},
    tags: [{type: Schema.ObjectId, ref: 'tag'}],
    user: {type: Schema.ObjectId, ref: 'user'},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

postSchema.set('toJSON', {virtuals: true});
postSchema.index({searchField: 1}, {unique: false});

module.exports = mongoose.model('post', postSchema);
