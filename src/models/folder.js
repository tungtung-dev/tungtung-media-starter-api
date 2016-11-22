var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var folderSchema = new Schema({
    name: String,
    slug: String,
    userId: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

folderSchema.virtual('id').get(function () {
    return this._id;
});

folderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('folder', folderSchema);
