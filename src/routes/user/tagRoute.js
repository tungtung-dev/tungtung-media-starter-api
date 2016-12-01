/**
 * Created by Tien Nguyen on 8/7/16.
 */

import express from "express";
import {getAllTagsWithPagination} from "../../dao/tagDao";
import {getAllTagsWithoutPagination} from "../../dao/tagDao";
import {getTag} from "../../dao/tagDao";
import {showResultToClient} from "../../utils/responseUtils";

var router = express.Router();

// Support api: /tags to get all tag with pagination info
// Support select tags by tag name, example /tags?tag_name=vật
router.get('/', getTagsRoute);

router.get('/without-pagination', getTagsWithoutPaginationRoute);

router.get('/:tag', getTagRoute);

export function getTagRoute(req, res) {
    let tag = req.params.tag;
    let isValid = ObjectId.isValid(tag);
    let queryObj = isValid ? {_id: tag} : {slug: tag};
    getTag(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
}

export function getTagsRoute(req, res) {
    let paginationInfo = req.query;
    getAllTagsWithPagination(paginationInfo, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
}

export function getTagsWithoutPaginationRoute(req, res, next) {
    getAllTagsWithoutPagination((err, data) => {
        showResultToClient(err, data, res);
    });
}

export default router;