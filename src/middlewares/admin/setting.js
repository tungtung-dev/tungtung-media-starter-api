/**
 * Created by Tien Nguyen on 11/26/16.
 */
import {checkPermission} from "../middlewareUtils";
import {getToken} from "../middlewareUtils";

/**
 * Check edit post permission middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function viewSettingMiddleware(req, res, next) {
    let action = 'delete';
    let contentType = 'setting';
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
function createSettingMiddleware(req, res, next) {
    let action = 'add';
    let contentType = 'setting';
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
function editSettingMiddleware(req, res, next) {
    let action = 'change';
    let contentType = 'setting';
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
function deleteSettingMiddleware(req, res, next) {
    let action = 'delete';
    let contentType = 'setting';
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

export {viewSettingMiddleware, createSettingMiddleware, editSettingMiddleware, deleteSettingMiddleware}