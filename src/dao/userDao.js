/**
 * Created by Tien Nguyen on 10/15/16.
 */
import User from "../models/user";
import bscrypt from "../utils/bcrypt";
import Pagination from "pagination-js";
import {createTokenAndGetUser} from "../utils/index";

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
        .sort({createdAt: -1})
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
 * @param queryObj
 * @param permissionIds
 * @param callback
 */
export function updateUserPermission(queryObj, permissionIds, callback) {
    User.findOneAndUpdate(queryObj, {$set: {permissions: permissionIds}}).exec(callback);
}

/**
 * Get user permissions
 * @param queryObj
 * @param callback
 */
export function getUserPermission(queryObj, callback) {
    User.findOne(queryObj).populate({path: "permissions"}).exec((err, user) => {
        callback(err, user === null ? [] : user.permissions);
    });
}

/**
 * Create the first super admin
 * @param callback
 */
export function createSuperAdmin(callback) {
    (async() => {
        let haveSuperAdmin = (await User.count({superAdmin: true}).exec()) > 0;
        if (!haveSuperAdmin) {
            let defaultPassword = 'admin';
            let hashedPassword = bscrypt.generate(defaultPassword);
            let user = new User({
                username: 'admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                superAdmin: true
            });
            user.save((err, u) => {
                callback(err, {message: 'Please change the default password'});
            });
        } else {
            callback(new Error('Already have super admin'));
        }
    })();
}

/**
 * Get User by query, paginate it and sort by sorter object
 * @param queryObj
 * @param paginationInfo
 * @param orderByObj
 * @param callback
 */
export function getUsers(queryObj, paginationInfo, orderByObj, callback) {
    (async() => {
        try {
            let totalItem = await User.count(queryObj).exec();
            let pagination = (new Pagination(paginationInfo, totalItem)).getPagination();
            User.find(queryObj)
                .select({password: 0})
                .skip(pagination.minIndex)
                .limit(pagination.itemPerPage)
                .sort(orderByObj)
                .exec((err, users) => {
                    callback(null, {data: users, pagination: pagination});
                });
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Ban user
 * @param queryObj
 * @param callback
 */
export function banUser(queryObj, callback) {
    User.findOneAndUpdate(queryObj, {$set: {banned: true}}, {new: true}).exec(callback);
}

/**
 * Ban user
 * @param queryObj
 * @param callback
 */
export function deBanUser(queryObj, callback) {
    User.findOneAndUpdate(queryObj, {$set: {banned: false}}, {new: true}).exec(callback);
}

/**
 *
 * @param queryObj
 * @param callback
 */
export function getUserInfo(queryObj, callback) {
    User.findOne(queryObj).select({password: 0}).exec((err, user) => {
        callback(err, {
            ...createTokenAndGetUser(user),
            ...user
        });
    })
}

export {
    selectUser, updatePassword, checkEmail, newestMember, totalAccount
}

export default {
    selectUser,
    updatePassword,
    checkEmail,
    newestMember,
    totalAccount
}