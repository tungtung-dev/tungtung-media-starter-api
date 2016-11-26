import {checkPermission} from "../middlewareUtils";
import {getToken} from "../middlewareUtils";
/**
 * Created by Tien Nguyen on 11/26/16.
 */

/**
 * Check view post permission middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function viewPostMiddleware(req, res, next) {
    let action = 'view';
    let contentType = 'post';
    var token = getToken(req);
    if (token) {
        checkPermission(token, action, contentType, (err, user) => {
            if (err) {
                return res.json({success: false, message: err.message});
            } else {
                req.user = user;
                req.token = token;
                next();
            }
        });
    } else {
        return res.status(403).send({success: false, message: 'No token provided'});
    }
}

/**
 * Check create post permission middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function createPostMiddleware(req, res, next) {
    let action = 'add';
    let contentType = 'post';
    var token = getToken(req);
    if (token) {
        checkPermission(token, action, contentType, (err, user) => {
            if (err) {
                return res.json({success: false, message: err.message});
            } else {
                req.user = user;
                req.token = token;
                next();
            }
        });
    } else {
        return res.status(403).send({success: false, message: 'No token provided'});
    }
}

/**
 * Check edit post permission middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function editPostMiddleware(req, res, next) {
    let action = 'change';
    let contentType = 'post';
    var token = getToken(req);
    if (token) {
        checkPermission(token, action, contentType, (err, user) => {
            if (err) {
                return res.json({success: false, message: err.message});
            } else {
                req.user = user;
                req.token = token;
                next();
            }
        });
    } else {
        return res.status(403).send({success: false, message: 'No token provided'});
    }
}

/**
 * Check edit post permission middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function deletePostMiddleware(req, res, next) {
    let action = 'delete';
    let contentType = 'post';
    var token = getToken(req);
    if (token) {
        checkPermission(token, action, contentType, (err, user) => {
            if (err) {
                return res.json({success: false, message: err.message});
            } else {
                req.user = user;
                req.token = token;
                next();
            }
        });
    } else {
        return res.status(403).send({success: false, message: 'No token provided'});
    }
}

export {viewPostMiddleware, createPostMiddleware, editPostMiddleware, deletePostMiddleware}