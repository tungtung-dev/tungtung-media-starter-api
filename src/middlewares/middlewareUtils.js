import jwt from "jsonwebtoken";
import config from "../config";
import {selectUser} from "../dao/userDao";
import {getPermissionByActAndContentType} from "../dao/permissionDao";

const AUTHORIZATION_START_POSITION = 4;

/**
 * Get token from header
 * @param req
 * @returns {*}
 */
function getTokenFromAuthorization(req) {
    var token = req.headers['authorization'];
    if (token != null) {
        return token.substr(AUTHORIZATION_START_POSITION, token.length);
    }
    return '';
}

/**
 * Get token from user request
 * @param req
 * @returns {*}
 */
function getToken(req) {
    var token = req.body.token || req.session.token || req.query.userToken || req.headers['x-access-token']
        || getTokenFromAuthorization(req);

    return token;
}

/**
 * Check user permission corresponding to action and content type
 * @param token
 * @param action
 * @param contentType
 * @param callback
 */
function checkPermission(token, action, contentType, callback) {
    // Verify given token and get payload data
    jwt.verify(token, config.secret, (err, payload) => {
        if (err) {
            callback(err);
        } else {
            (async() => {
                let permission = await getPermissionByActAndContentType(action, contentType);
                // Query user by payload data
                let queryObj = {
                    _id: payload._doc._id,
                    $or: [{superAdmin: true}, {permissions: permission._id}]
                };
                selectUser(queryObj, (err, user) => {
                    if (!err && user) {
                        callback(null, user);
                    }
                    else {
                        callback(new Error(`Không có quyền '${permission.name}'`));
                    }
                });
            })();
        }
    });
}

export {getTokenFromAuthorization, getToken, checkPermission}