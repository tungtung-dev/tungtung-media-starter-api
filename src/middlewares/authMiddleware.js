import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/user';
import {getToken} from "./middlewareUtils";
import {getPermissionByActAndContentType} from "../dao/permissionDao";

/**
 * Verify user authentication middleware
 * @param req user request
 * @param res response
 * @param next
 * @returns {*}
 */
export default (req, res, next) => {
    var token = getToken(req);
    if (token) {
        // Verify given token and get payload data
        jwt.verify(token, config.secret, (err, payload) => {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token'});
            } else {
                // Query user by payload data
                User.findById({_id: payload._doc._id})
                    .select({password: 0}).then(user => {
                    if (user) {
                        req.user = user;
                        req.token = token;
                        next();
                    }
                    else {
                        return res.json({success: false, message: 'User not found'});
                    }
                })
            }
        });
    }
    else {
        return res.status(403).send({
            success: false,
            message: 'No token provided'
        });
    }
}