/**
 * Created by Tien Nguyen on 11/11/16.
 */
import express from "express";
import {Setting} from "../../models/index";
import {viewSettingMiddleware, editSettingMiddleware} from "../../middlewares/admin/setting";
import {showResultToClient} from "../../utils/responseUtils";
import {editSettings} from "../../dao/settingDao";

var route = express.Router();

route.get('/', viewSettingMiddleware, function (req, res, next) {
    Setting.find().exec((err, settings) => {
        showResultToClient(err, settings, res);
    });
});

route.post('/', editSettingMiddleware, function (req, res, next) {
    editSettings(req.body, (err, data) => {
        showResultToClient(err, data, res);
    });
});

export default route;