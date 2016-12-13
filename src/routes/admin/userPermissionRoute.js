/**
 * Created by Tien Nguyen on 11/24/16.
 */
import express from "express";
import {updateUserPermission, getUserPermission} from "../../dao/userDao";
import {changeUserPermissionMiddleware, viewUserPermissionMiddleware} from "../../middlewares/admin/userPermission";
import {showResultToClient} from "../../utils/responseUtils";
import {isObjectId} from "../../utils/objectIdUtils";
import logger from '../../utils/logger';

var route = express.Router();
const TAG = 'user permission';

route.put('/:userKey', changeUserPermissionMiddleware, (req, res) => {
    let userKey = req.params.userKey;
    let queryObj = isObjectId(userKey) ? {_id: userKey} : {username: userKey};
    let permissionIds = req.body.permissionIds;
    logger.info(TAG, "perIds = " + permissionIds + " userKey " + userKey);
    updateUserPermission(queryObj, permissionIds, (err, data)=> {
        showResultToClient(err, data, res);
    });
});

route.get('/:userKey', viewUserPermissionMiddleware, (req, res) => {
    let userKey = req.params.userKey;
    let queryObj = isObjectId(userKey) ? {_id: userKey} : {username: userKey};
    getUserPermission(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
});


export default route;