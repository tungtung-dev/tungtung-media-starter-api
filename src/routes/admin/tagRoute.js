/**
 * Created by Tien Nguyen on 11/29/16.
 */
import express from "express";
import {saveTagIfNeededAsync, updateTag, deleteTag} from "../../dao/tagDao";
import {showResultToClient} from "../../utils/responseUtils";
import {getTagRoute, getTagsRoute, getTagsWithoutPaginationRoute} from "../user/tagRoute";
import {isObjectId} from "../../utils/objectIdUtils";
import {deleteTagMiddleware} from "../../middlewares/admin/tag";
import {editTagMiddleware} from "../../middlewares/admin/tag";
import {viewTagMiddleware} from "../../middlewares/admin/tag";
import {createTagMiddleware} from "../../middlewares/admin/tag";

var route = express.Router();

route.get('/', viewTagMiddleware, getTagsRoute);

route.post('/', createTagMiddleware, function (req, res, next) {
    var tag = req.body.name;
    saveTagIfNeededAsync(tag, (err, data) => {
        showResultToClient(err, data, res);
    });
});

route.get('/without-pagination', viewTagMiddleware, getTagsWithoutPaginationRoute);

route.get('/:tag', viewTagMiddleware, getTagRoute);

route.put('/:tag', editTagMiddleware, function (req, res, next) {
    let tag = req.params.tag;
    let isValid = isObjectId(tag);
    let queryObj = isValid ? {_id: tag} : {slug: tag};
    updateTag(queryObj, req.body.name, (err, data) => {
        showResultToClient(err, data, res);
    });
});

route.delete('/:tag', deleteTagMiddleware, function (req, res, next) {
    let tag = req.params.tag;
    let isValid = isObjectId(tag);
    let queryObj = isValid ? {_id: tag} : {slug: tag};
    deleteTag(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
});

export default route;