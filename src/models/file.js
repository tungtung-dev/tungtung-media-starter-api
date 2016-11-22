import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var fileSchema = new Schema({
    name: String,
    type: String,
    folderId: String,
    folderSlug: String,
    userId: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

fileSchema.virtual('id').get(function () {
    return this._id;
});

fileSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('file', fileSchema);
