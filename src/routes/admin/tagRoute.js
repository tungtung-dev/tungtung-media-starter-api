/**
 * Created by Tien Nguyen on 11/29/16.
 */
import express from "express";
import {saveTagIfNeededAsync, updateTag, deleteTag} from "../../dao/tagDao";
import mongoose from "mongoose";
import {showResultToClient} from "../../utils/responseUtils";
import {getTagRoute, getTagsRoute, getTagsWithoutPaginationRoute} from "../user/tagRoute";

var ObjectId = mongoose.Types.ObjectId;
var route = express.Router();

// TODO need to add authorization middleware
route.get('/', getTagsRoute);

// TODO need to add authorization middleware
route.post('/', function (req, res, next) {
    var tag = req.body.name;
    saveTagIfNeededAsync(tag, (err, data) => {
        showResultToClient(err, data, res);
    });
});

// TODO need to add authorization middleware
route.get('/without-pagination', getTagsWithoutPaginationRoute);

route.get('/:tag', getTagRoute);

// TODO need to add authorization middleware
route.put('/:tag', function (req, res, next) {
    let tag = req.params.tag;
    let isValid = ObjectId.isValid(tag);
    let queryObj = isValid ? {_id: tag} : {slug: tag};
    updateTag(queryObj, req.body.name, (err, data) => {
        showResultToClient(err, data, res);
    });
});

// TODO need to add authorization middleware
route.delete('/:tag', function (req, res, next) {
    let tag = req.params.tag;
    let isValid = ObjectId.isValid(tag);
    let queryObj = isValid ? {_id: tag} : {slug: tag};
    deleteTag(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
});

export default route;