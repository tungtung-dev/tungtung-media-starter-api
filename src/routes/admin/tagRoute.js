/**
 * Created by Tien Nguyen on 11/29/16.
 */
import express from "express";
import {getAllTagsWithPagination} from "../../dao/tagDao";
import {getAllTagsWithoutPagination} from "../../dao/tagDao";
import {saveTagIfNeededAsync} from "../../dao/tagDao";
import mongoose from 'mongoose';
import {updateTag} from "../../dao/tagDao";
import {getTag} from "../../dao/tagDao";


var ObjectId = mongoose.Types.ObjectId;
var route = express.Router();

route.get('/', function (req, res, next) {
    let paginationInfo = req.query;
    getAllTagsWithPagination(paginationInfo, (err, data) => {
        if (err) {
            res.json({success: false, message: err.message === null ? "Unknown err" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.post('/', function (req, res, next) {
    var tag = req.body.name;
    saveTagIfNeededAsync(tag, (err, data) => {
        if (err) {
            res.json({success: false, message: err.message === null ? "Unknown err" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.get('/without-pagination', function (req, res, next) {
    getAllTagsWithoutPagination((err, data) => {
        if (err) {
            res.json({success: false, message: err.message === null ? "Unknown err" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.get('/:tag', function (req, res, next) {
    let tag = req.params.tag;
    let isValid = ObjectId.isValid(tag);
    let queryObj = isValid ? {_id: tag} : {slug: tag};
    getTag(queryObj, (err, data) => {
        if (err || data === null) {
            res.json({success: false, message: data === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.put('/:tag', function (req, res, next) {
    let tag = req.params.tag;
    let isValid = ObjectId.isValid(tag);
    let queryObj = isValid ? {_id: tag} : {slug: tag};
    updateTag(queryObj, req.body.name, (err, data) => {
        if (err) {
            res.json({success: false, message: err.message === null ? "Unknown err" : err.message});
        } else {
            res.json(data);
        }
    });
});

export default route;