import config from '../config';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import request from 'request';

export function cleanUser(user) {
    return Object.assign(user, {
        id: user.id,
        password: ''
    });
}

export function getQueryUserId(user_id, other_object) {
    user_id = user_id.toString();
    var query = {};
    if (!other_object) other_object = {};
    if (user_id.match(/^[0-9a-fA-F]{24}$/)) {
        query = {user_id: user_id}
    }
    else {

        query = {username: user_id}
    }
    return Object.assign(query, other_object);
}


export function createTokenAndGetUser(user) {
    var token = jwt.sign(user, config.secret, {
        expiresIn: '30days' // expires in 24 hours
    });
    return {
        token,
        user: user
    };
}

export function downloadImage(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}