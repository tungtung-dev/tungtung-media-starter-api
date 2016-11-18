import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var blogPostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true},
    description: {type: String},
    content: {type: String},
    tags: [{type: Schema.ObjectId, ref: 'tag'}],
    user: {type: Schema.ObjectId, ref: 'user'},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

blogPostSchema.set('toJSON', {virtuals: true});

export default mongoose.model('blog', blogPostSchema);
