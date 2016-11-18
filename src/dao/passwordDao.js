import Password from "../models/password";
import crypto from "crypto";
import {updatePassword as updatePasswordUser, checkEmail} from "../dao/userDao";

var hash = (code) => crypto.createHash('md5').update(code).digest('hex');

function createForgotPassword(email) {
    return new Promise((resolve, reject) => {
        checkEmail(email).then(() => {
            var password = new Password({email, token: hash(email + (new Date()).toString())});
            password.save().then(p => {
                resolve(p);
            }).catch(e => reject(e));
        }).catch(e => reject(e));
    })
}

function checkToken(token) {
    return new Promise((resolve, reject) => {
        Password.findOne({token}).select({password: 0}).then(p => {
            if (p) {
                resolve(p);
            }
            else {
                reject({message: 'Token isn\'t exists'});
            }
        }).catch(e => {
            reject(e);
        });
    })
}

function updatePassword(token, password) {
    return new Promise((resolve, reject) => {
        checkToken(token).then(p => {
            updatePasswordUser(p.email, password).then(data => {
                Password.find({email: p.email}).remove().exec();
                resolve(data);
            }).catch(e => reject(e));
        }).catch(e => reject(e));
    });
}

export {createForgotPassword, checkToken, updatePassword}
export default {createForgotPassword, checkToken, updatePassword}