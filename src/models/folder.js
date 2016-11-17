var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FolderSchema = new Schema({
    name: String,
    slug: String,
    user_id: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

FolderSchema.virtual('id').get(function () {
    return this._id;
});

FolderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('folder', FolderSchema);
