/**
 * Created by Tien Nguyen on 11/11/16.
 */

import express from "express";
import Setting from "../../models/setting";

var route = express.Router();

route.get('/', function (req, res, next) {
    Setting.find({is_private: false}).exec((err, settings) => {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            res.json(settings);
        }
    });
});


export default route;