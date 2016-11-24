/**
 * Created by Tien Nguyen on 11/24/16.
 */
import express from "express";
import {getAllPermissionWithPagination} from "../../dao/permissionDao";
import url from 'url';
import {
    viewPermissionMiddleware,
    addPermissionMiddleware,
    changePermissionMiddleware,
    deletePermissionMiddleware
} from "../../middlewares/authAdminMiddleware";

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
    res.json({message: "being implemented"});
});

route.put('/:permissionId', changePermissionMiddleware, (req, res) => {
    res.json({message: "being implemented"});
});

route.get('/:permissionId', viewPermissionMiddleware, (req, res) => {
    res.json({message: "being implemented"});
});

route.delete('/:permissionId', deletePermissionMiddleware, (req, res) => {
    res.json({message: "being implemented"});
});


export default route;