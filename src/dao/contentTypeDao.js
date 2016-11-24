/**
 * Created by Tien Nguyen on 11/23/16.
 */
import {ContentType} from '../models/index';
import contentTypeDefault from './default-data/contentTypes';
import asyncLib from 'async';
import Pagination from 'pagination-js';

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

/**
 * Get all content types with pagination
 * @param paginationInfo include itemPerPage and page index information
 * @param callback
 */
function getAllContentTypeWithPagination(paginationInfo, callback) {
    (async()=> {
        let queryObj = {};
        let count = await ContentType.count(queryObj).exec();
        let pagination = (new Pagination(paginationInfo, count)).getPagination();
        ContentType.find(queryObj)
            .skip(pagination.minIndex)
            .limit(pagination.itemPerPage)
            .exec((err, contentTypes) => {
                callback(err, {data: contentTypes, pagination});
            });
    })();
}


export {setupDefaultContentType, getAllContentTypeWithPagination}