/**
 * Created by Tien Nguyen on 11/11/16.
 */

import express from "express";
import {Setting} from "../../models/index";
import {showResultToClient} from "../../utils/responseUtils";

var route = express.Router();

route.get('/', function (req, res, next) {
    Setting.find({isPrivate: false}).exec((err, settings) => {
        showResultToClient(err, settings, res);
    });
});


export default route;