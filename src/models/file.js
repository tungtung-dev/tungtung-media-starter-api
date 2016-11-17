var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({
    name: String,
    type: String,
    folder_id: String,
    folder_slug: String,
    user_id: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

FileSchema.virtual('id').get(function () {
    return this._id;
});

FileSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('file', FileSchema);
