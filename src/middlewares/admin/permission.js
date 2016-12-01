import {getToken, checkPermission, processResult, checkSuperAdminPermission} from "../middlewareUtils";

/**
 * Verify admin user authentication middleware
 * @param req user request
 * @param res response
 * @param next
 * @returns {*}
 */
function supperAdminMiddleware(req, res, next) {
    var token = getToken(req);
    checkSuperAdminPermission(token, (err, user) => {
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
function viewPermissionMiddleware(req, res, next) {
    let action = 'view';
    let contentType = 'permission';
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
function addPermissionMiddleware(req, res, next) {
    let action = 'add';
    let contentType = 'permission';
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
function changePermissionMiddleware(req, res, next) {
    let action = 'change';
    let contentType = 'permission';
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
function deletePermissionMiddleware(req, res, next) {
    let action = 'delete';
    let contentType = 'permission';
    var token = getToken(req);
    checkPermission(token, action, contentType, (err, user) => {
        processResult(err, user, token, req, res, next);
    });
}

export {
    supperAdminMiddleware,
    viewPermissionMiddleware,
    addPermissionMiddleware,
    changePermissionMiddleware,
    deletePermissionMiddleware
}
