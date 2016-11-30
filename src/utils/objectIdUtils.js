/**
 * Created by Tien Nguyen on 11/30/16.
 */
import mongoose from 'mongoose';

var ObjectId = mongoose.Types.ObjectId;

export function isObjectId(inputStr) {
    return ObjectId.isValid(inputStr);
}
