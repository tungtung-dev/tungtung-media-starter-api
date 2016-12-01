import {checkPermission} from "../middlewareUtils";
import {getToken} from "../middlewareUtils";
import {processResult} from "../middlewareUtils";
/**
 * Created by Tien Nguyen on 11/26/16.
 */

/**
 * Check create post permission middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function viewUserPermissionMiddleware(req, res, next) {
    let action = 'view';
    let contentType = 'user_permission';
    var token = getToken(req);
    checkPermission(token, action, contentType, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}

/**
 * Check create post permission middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function addUserPermissionMiddleware(req, res, next) {
    let action = 'add';
    let contentType = 'user_permission';
    var token = getToken(req);

    checkPermission(token, action, contentType, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}

/**
 * Check create post permission middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function changeUserPermissionMiddleware(req, res, next) {
    let action = 'change';
    let contentType = 'user_permission';
    var token = getToken(req);
    checkPermission(token, action, contentType, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}

/**
 * Check create post permission middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function deleteUserPermissionMiddleware(req, res, next) {
    let action = 'delete';
    let contentType = 'user_permission';
    var token = getToken(req);
    checkPermission(token, action, contentType, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}

export {
    viewUserPermissionMiddleware,
    addUserPermissionMiddleware,
    changeUserPermissionMiddleware,
    deleteUserPermissionMiddleware
}