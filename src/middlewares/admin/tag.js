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
function viewTagMiddleware(req, res, next) {
    let action = 'view';
    let contentType = 'tag';
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
function createTagMiddleware(req, res, next) {
    let action = 'add';
    let contentType = 'tag';
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
function editTagMiddleware(req, res, next) {
    let action = 'change';
    let contentType = 'tag';
    var token = getToken(req);
    checkPermission(token, action, contentType, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}

/**
 * Check edit post permission middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function deleteTagMiddleware(req, res, next) {
    let action = 'delete';
    let contentType = 'tag';
    var token = getToken(req);
    checkPermission(token, action, contentType, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}

export {viewTagMiddleware, createTagMiddleware, editTagMiddleware, deleteTagMiddleware}