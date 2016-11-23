/**
 * Created by Tien Nguyen on 11/23/16.
 */
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var permissionSchema = new Schema({
    name: {type: String},
    codeName: {type: String},
    contentType: {type: Schema.ObjectId, ref: 'content_type'},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

permissionSchema.virtual('id').get(function () {
    return this._id;
});

permissionSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('permission', permissionSchema);
