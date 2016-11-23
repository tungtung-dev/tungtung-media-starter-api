/**
 * Created by Tien Nguyen on 11/23/16.
 */
import {ContentType} from '../models/index';
import contentTypeDefault from './default-data/contentTypes';
import asyncLib from 'async';

/**
 * Add default content type into database if it's not exist
 * @returns {Promise}
 */
function setupDefaultContentType(callback) {
    (async() => {
        let count = await ContentType.count({}).exec();
        if (count > 0) {
            callback(new Error("Already Exists"), {message: "Fail"});
        } else {
            ContentType.remove().exec();
            var items = contentTypeDefault.models;
            asyncLib.forEachOf(items, function (item, index, cb) {
                var contentType = new ContentType(item);
                contentType.save(cb);
            }, function (err) {
                callback(err, {message: "Done"});
            });
        }
    })();
}

export {setupDefaultContentType}