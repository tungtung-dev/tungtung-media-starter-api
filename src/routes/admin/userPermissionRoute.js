/**
 * Created by Tien Nguyen on 11/24/16.
 */
import express from "express";
import {
    viewUserPermissionMiddleware,
    addUserPermissionMiddleware,
    changeUserPermissionMiddleware,
    deleteUserPermissionMiddleware
} from "../../middlewares/authAdminMiddleware";

var route = express.Router();


route.get('/', viewUserPermissionMiddleware, (req, res) => {
    res.json({success: false, message: "being implemented"});
});

route.post('/', addUserPermissionMiddleware, (req, res) => {
    res.json({success: false, message: "being implemented"});
});

route.put('/:permissionId', changeUserPermissionMiddleware, (req, res) => {
    res.json({success: false, message: "being implemented"});
});

route.get('/:userId', viewUserPermissionMiddleware, (req, res) => {
    res.json({success: false, message: "being implemented"});
});

route.delete('/:userId', deleteUserPermissionMiddleware, (req, res) => {
    res.json({success: false, message: "being implemented"});
});


export default route;