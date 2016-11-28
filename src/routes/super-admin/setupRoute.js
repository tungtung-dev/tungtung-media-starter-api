/**
 * Created by Tien Nguyen on 11/23/16.
 */
import express from "express";
import {setupDefaultContentType} from "../../dao/contentTypeDao";
import {setupDefaultPermission} from "../../dao/permissionDao";
import {supperAdminMiddleware} from "../../middlewares/admin/permission";
import {createSuperAdmin} from "../../dao/userDao";

var route = express.Router();

route.get('/init', supperAdminMiddleware, (req, res) => {
    setupDefaultContentType((err, message) => {
        setupDefaultPermission((err, message) => {
            if (err) {
                res.json({success: false, message: err.message});
            } else {
                res.json({success: true, message});
            }
        });
    })
});

route.get('/init-super-admin', (req, res) => {
    createSuperAdmin((err, user) => {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            res.json({success: true, user});
        }
    });
});


export default route;
