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
import url from "url";
import {
    viewPermissionMiddleware,
    addPermissionMiddleware,
    changePermissionMiddleware,
    deletePermissionMiddleware
} from "../../middlewares/admin/permission";

var route = express.Router();

route.get('/', viewPermissionMiddleware, (req, res) => {
    let urlParts = url.parse(req.url, true);
    let query = urlParts.query;
    getAllPermissionWithPagination(query, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.post('/', addPermissionMiddleware, (req, res) => {
    let {name, codeName} = req.body;
    let permission = {name, codeName, updatedAt: new Date(), createdAt: new Date()};
    savePermission(permission, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.get('/by-content-types/:contentType', viewPermissionMiddleware, (req, res)=> {
    let contentType = req.params.contentType;
    getPermissionWithPagination(contentType, req.query, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});


route.put('/:permissionId', changePermissionMiddleware, (req, res) => {
    let permissionId = req.params.permissionId;
    let {name, codeName} = req.body;
    let permission = {name, codeName, updatedAt: new Date()};
    updatePermission(permissionId, permission, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.get('/:permissionId', viewPermissionMiddleware, (req, res) => {
    let permissionId = req.params.permissionId;
    getPermissionById(permissionId, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.delete('/:permissionId', deletePermissionMiddleware, (req, res) => {
    let permissionId = req.params.permissionId;
    removePermissionById(permissionId, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});


export default route;