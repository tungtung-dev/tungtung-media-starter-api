import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var blogPostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true},
    searchField: {type: String, required: true},
    description: {type: String},
    content: {type: String},
    tags: [{type: Schema.ObjectId, ref: 'tag'}],
    user: {type: Schema.ObjectId, ref: 'user'},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

blogPostSchema.set('toJSON', {virtuals: true});
blogPostSchema.index({searchField: 1}, {unique: false});

export default mongoose.model('blog', blogPostSchema);
