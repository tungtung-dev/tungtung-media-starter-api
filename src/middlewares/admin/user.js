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
function viewUserMiddleware(req, res, next) {
    let action = 'view';
    let contentType = 'user';
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
function createUserMiddleware(req, res, next) {
    let action = 'add';
    let contentType = 'user';
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
function editUserMiddleware(req, res, next) {
    let action = 'change';
    let contentType = 'user';
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
function deleteUserMiddleware(req, res, next) {
    let action = 'delete';
    let contentType = 'user';
    var token = getToken(req);
    checkPermission(token, action, contentType, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}

export {viewUserMiddleware, createUserMiddleware, editUserMiddleware, deleteUserMiddleware}