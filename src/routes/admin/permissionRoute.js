/**
 * Created by Tien Nguyen on 11/24/16.
 */
import express from "express";
import {
    getAllPermissionWithPagination,
    savePermission,
    updatePermission,
    getPermissionById,
    removePermissionById,
    getPermissionWithPagination
} from "../../dao/permissionDao";
import {
    viewPermissionMiddleware,
    addPermissionMiddleware,
    changePermissionMiddleware,
    deletePermissionMiddleware
} from "../../middlewares/admin/permission";
import {showResultToClient} from "../../utils/responseUtils";

var route = express.Router();

route.get('/', viewPermissionMiddleware, (req, res) => {
    getAllPermissionWithPagination(req.query, (err, data) => {
        showResultToClient(err, data, res);
    });
});

route.post('/', addPermissionMiddleware, (req, res) => {
    let {name, codeName} = req.body;
    let permission = {name, codeName, updatedAt: new Date(), createdAt: new Date()};
    savePermission(permission, (err, data) => {
        showResultToClient(err, data, res);
    });
});

route.get('/by-content-types/:contentType', viewPermissionMiddleware, (req, res)=> {
    let contentType = req.params.contentType;
    getPermissionWithPagination(contentType, req.query, (err, data) => {
        showResultToClient(err, data, res);
    });
});


route.put('/:permissionId', changePermissionMiddleware, (req, res) => {
    let permissionId = req.params.permissionId;
    let {name, codeName} = req.body;
    let permission = {name, codeName, updatedAt: new Date()};
    updatePermission(permissionId, permission, (err, data) => {
        showResultToClient(err, data, res);
    });
});

route.get('/:permissionId', viewPermissionMiddleware, (req, res) => {
    let permissionId = req.params.permissionId;
    getPermissionById(permissionId, (err, data) => {
        showResultToClient(err, data, res);
    });
});

route.delete('/:permissionId', deletePermissionMiddleware, (req, res) => {
    let permissionId = req.params.permissionId;
    removePermissionById(permissionId, (err, data) => {
        showResultToClient(err, data, res);
    });
});


export default route;