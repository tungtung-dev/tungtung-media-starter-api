/**
 * Created by Tien Nguyen on 11/11/16.
 */
import express from "express";
import {Setting} from "../../models/index";
import authAdminMiddleware from "../../middlewares/authAdminMiddleware";

var route = express.Router();

route.get('/', authAdminMiddleware, function (req, res, next) {
    Setting.find().exec((err, settings) => {
        if (err) {
            res.json({success: false, message: err.message});
        } else {
            res.json(settings);
        }
    });
});

route.post('/', authAdminMiddleware, function (req, res, next) {
    let keys = Object.keys(req.body);
    (async() => {
        try {
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let value = req.body[key];
                let isPrivate = req.body[key].isPrivate;
                console.log("key = " + key + " value = " + value + " isPrivate = " + isPrivate);
                await Setting.update({key: key}, {
                    $setOnInsert: {
                        key: key,
                        createdAt: new Date()
                    },
                    $set: {
                        value: value,
                        isPrivate: isPrivate,
                        updatedAt: new Date()
                    }
                }, {upsert: true}).exec();
            }
            Setting.find().exec((err, settings) => {
                if (err) {
                    res.json({success: false, message: err.message});
                } else {
                    res.json(settings);
                }
            });
        } catch (err) {
            res.json({success: false, message: err.message});
        }
    })();
});

export default route;