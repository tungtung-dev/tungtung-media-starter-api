import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/user';

function getTokenFromAuthorization(req) {
    var token = req.headers['authorization'];
    if (token != null) {
        return token.substr(4, token.length);
    }
    return '';
}

export default (req, res, next) => {
    var token = req.body.token || req.session.token || req.query.user_token || req.headers['x-access-token'] || getTokenFromAuthorization(req);
    if (token) {
        jwt.verify(token, config.secret, (err, payload) => {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token'});
            } else {
                User.findById({_id: payload._doc._id, admin: true}).then(user => {
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
        })
    }
}