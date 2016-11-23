/**
 * Created by Tien Nguyen on 11/23/16.
 */
import express from "express";
import {setupDefaultContentType} from "../../dao/contentTypeDao";
import {setupDefaultPermission} from "../../dao/permissionDao";

var route = express.Router();

route.get('/init', (req, res) => {
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


export default route;
