/**
 * Created by Tien Nguyen on 12/1/16.
 */
import {checkPermission} from "../middlewareUtils";
import {getToken} from "../middlewareUtils";
import {processResult} from "../middlewareUtils";

/**
 * Check view post category middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function viewCategoryMiddleware(req, res, next) {
    let action = 'view';
    let contentType = 'category';
    var token = getToken(req);
    checkPermission(token, action, contentType, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}

/**
 * Check create post category middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function createCategoryMiddleware(req, res, next) {
    let action = 'add';
    let contentType = 'category';
    var token = getToken(req);
    checkPermission(token, action, contentType, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}

/**
 * Check edit post category middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function editCategoryMiddleware(req, res, next) {
    let action = 'change';
    let contentType = 'category';
    var token = getToken(req);
    checkPermission(token, action, contentType, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}

/**
 * Check edit post category middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function deleteCategoryMiddleware(req, res, next) {
    let action = 'delete';
    let contentType = 'category';
    var token = getToken(req);
    checkPermission(token, action, contentType, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}

export {viewCategoryMiddleware, createCategoryMiddleware, editCategoryMiddleware, deleteCategoryMiddleware}