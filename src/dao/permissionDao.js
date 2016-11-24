/**
 * Created by Tien Nguyen on 11/23/16.
 */
import {Permission, ContentType} from '../models/index';
import permissionsDefault from './default-data/permissions';
import asyncLib from 'async';
import Pagination from 'pagination-js';

/**
 * Insert default permission into database if it's not exist
 * @param callback
 */
function setupDefaultPermission(callback) {
    (async() => {
        let count = await Permission.count({}).exec();
        let contentTypeCount = await ContentType.count().exec();
        if (contentTypeCount <= 0) {
            callback(new Error("There is no content type"), {message: "Fail"});
        } else if (count > 0) {
            callback(new Error("Already Exists"), {message: "Fail"});
        } else {
            Permission.remove().exec();
            var permissions = permissionsDefault.models;
            asyncLib.forEachOf(permissions, function (permission, index, cb) {
                var contentType = new Permission(permission);
                contentType.save(cb);
            }, function (err) {
                callback(err, {message: "Done"});
            });
        }
    })();
}

/**
 * Get all permission with pagination
 * @param paginationInfo include itemPerPage and page index information
 * @param callback
 */
function getAllPermissionWithPagination(paginationInfo, callback) {
    (async()=> {
        let queryObj = {};
        let count = await Permission.count(queryObj).exec();
        let pagination = (new Pagination(paginationInfo, count)).getPagination();
        Permission.find(queryObj)
            .skip(pagination.minIndex)
            .limit(pagination.itemPerPage)
            .exec((err, permissions) => {
                callback(err, {data: permissions, pagination});
            });
    })();
}

/**
 * Get permission object by action and content type
 * @param action
 * @param contentType
 */
async function getPermissionByActAndContentType(action, contentType) {
    let name = `${action}_${contentType}`;
    return Permission.findOne({codeName: name}).exec();
}

export {setupDefaultPermission, getAllPermissionWithPagination, getPermissionByActAndContentType}