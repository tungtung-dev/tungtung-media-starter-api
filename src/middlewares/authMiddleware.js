var fetch = require('node-fetch');
import config from "../config";

var authMiddleware = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
        fetch(`${config.auth_api}/auth/me`, {
            headers: {
                'Authorization': req.headers['authorization']
            }
        }).then(function (data) {
            return data.json();
        }).then(function (data) {
            if (data) {
                req.user = data;
                next();
            } else {
                res.json({success: false, message: 'Login error'});
            }
        }).catch(function (error) {
            console.log(error);

            res.json({success: false, message: 'Login error'});
        })
    }
    else {
        return res.status(403).send({
            success: false,
            message: 'No token provied'
        })
    }
};

export default authMiddleware;
