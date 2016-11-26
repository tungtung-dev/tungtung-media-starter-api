/**
 * Created by Tien Nguyen on 11/24/16.
 */
import express from "express";
import {updateUserPermission, getUserPermission} from "../../dao/userDao";
import {changeUserPermissionMiddleware, viewUserPermissionMiddleware} from "../../middlewares/admin/userPermission";

var route = express.Router();

route.put('/:username', changeUserPermissionMiddleware, (req, res) => {
    let username = req.params.username;
    let permissionIds = req.body.permissionIds;
    console.log("perIds = " + permissionIds + " username " + username);
    updateUserPermission(username, permissionIds, (err, data)=>{
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.get('/:username', viewUserPermissionMiddleware, (req, res) => {
    let username = req.params.username;
    getUserPermission(username, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});


export default route;