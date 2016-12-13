/**
 * Created by Tien Nguyen on 10/2/16.
 */

import express from "express";
import {User} from "../../models/index";
import {createTokenAndGetUser} from "../../utils/index";
import {viewUserMiddleware, deleteUserMiddleware} from "../../middlewares/admin/user";
import {showResultToClient} from "../../utils/responseUtils";
import {getUsers} from "../../dao/userDao";
import {getOrderByObject} from "../../utils/orderByManager";
import {isObjectId} from "../../utils/objectIdUtils";
import {banUser} from "../../dao/userDao";
import {getUserInfo} from "../../dao/userDao";
import {deBanUser} from "../../dao/userDao";

var route = express.Router();
const TAG = "UserAdminRoute";

route.get('/', viewUserMiddleware, function (req, res, next) {
    let query = req.query;
    var orderByObj = getOrderByObject(query);
    let {keyword} = req.query;
    let queryObj = (keyword === null || keyword === undefined) ? {} : {$or: [{email: /keyword/i}, {username: /keyword/i}]};
    getUsers(queryObj, query, orderByObj, (err, data) => {
        showResultToClient(err, data, res);
    });
});


route.get('/:userKey', viewUserMiddleware, (req, res) => {
    const {userKey} = req.params;
    let queryObj = isObjectId(userKey) ? {_id: userKey} : {username: userKey};
    getUserInfo(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
});

route.put('/ban/:userKey', deleteUserMiddleware, (req, res) => {
    const {userKey} = req.params;
    let queryObj = isObjectId(userKey) ? {_id: userKey} : {username: userKey};
    banUser(queryObj, (err, data) => {
       showResultToClient(err, data, res);
    });
});

route.put('/de-ban/:userKey', deleteUserMiddleware, (req, res) => {
    const {userKey} = req.params;
    let queryObj = isObjectId(userKey) ? {_id: userKey} : {username: userKey};
    deBanUser(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
});


export default route;