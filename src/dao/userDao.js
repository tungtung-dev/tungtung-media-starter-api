/**
 * Created by Tien Nguyen on 10/15/16.
 */
import User from "../models/user";
import bscrypt from "../utils/bcrypt";

const TAG = "UserDAO";

function selectUser(query, callback) {
    User.findOne(query).exec(callback);
}

function updateBalance(queryObj, value, callback) {
    User.findOne(queryObj).exec((err, user) => {
        if (err) {
            callback(err);
        } else {
            user.balance += value;
            user.updatedAt = new Date();
        }
    });
}

function updatePassword(email, password) {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({email}, {password: bscrypt.generate(password)}, {new: true}).select({password: 0}).then(user => {
            if (user) {
                resolve(user);
            }
            else {
                reject({message: 'Not found email user'});
            }
        }).catch(e => {
            reject({message: 'Not found email user'});
        });
    })
}

function checkEmail(email) {
    return new Promise((resolve, reject) => {
        User.findOne({email}).then(user => {
            if (user) resolve(user);
            else reject({message: 'Not found user'})
        }).catch(e => {
            reject({message: 'Not found user'});
        });
    })
}

function newestMember(callback) {
    User.findOne({})
        .select({password: 0})
        .sort({created_at: -1})
        .exec((err, user)=> {
            callback(err, user.username);
        });
}

function totalAccount(callback) {
    User.count({}).exec(callback);
}

export {
    selectUser, updateBalance, updatePassword, checkEmail, newestMember, totalAccount
}

export default {
    selectUser,
    updateBalance,
    updatePassword,
    checkEmail,
    newestMember,
    totalAccount
}