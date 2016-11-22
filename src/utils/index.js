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

export function getQueryUserId(userId, otherObject) {
    userId = userId.toString();
    var query = {};
    if (!otherObject) otherObject = {};
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
        query = {user_id: userId}
    }
    else {

        query = {username: userId}
    }
    return Object.assign(query, otherObject);
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