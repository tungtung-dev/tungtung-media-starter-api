/**
 * Created by Tien Nguyen on 10/15/16.
 */
import User from "../models/user";
import bscrypt from "../utils/bcrypt";

const TAG = "UserDAO";

/**
 *
 * @param query
 * @param callback
 */
function selectUser(query, callback) {
    User.findOne(query)
        .select({password: 0})
        .exec(callback);
}

/**
 *
 * @param queryObj
 * @param value
 * @param callback
 */
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

/**
 *
 * @param email
 * @param password
 * @returns {Promise}
 */
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

/**
 *
 * @param email
 * @returns {Promise}
 */
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

/**
 *
 * @param callback
 */
function newestMember(callback) {
    User.findOne({})
        .select({password: 0})
        .sort({created_at: -1})
        .exec((err, user)=> {
            callback(err, user.username);
        });
}

/**
 *
 * @param callback
 */
function totalAccount(callback) {
    User.count({}).exec(callback);
}

/**
 * Update user permission
 * @param username
 * @param permissionIds
 * @param callback
 */
export function updateUserPermission(username, permissionIds, callback) {
    User.findOneAndUpdate({username: username}, {$set: {permissions: permissionIds}}).exec(callback);
}

/**
 * Get user permissions
 * @param username
 * @param callback
 */
export function getUserPermission(username, callback) {
    User.findOne({username: username}).populate({path: "permissions"}).exec((err, user) => {
        callback(err, user === null ? [] : user.permissions);
    });
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