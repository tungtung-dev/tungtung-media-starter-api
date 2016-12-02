/**
 * Created by Tien Nguyen on 8/7/16.
 */

import express from "express";
import {getAllTagsWithPagination} from "../../dao/tagDao";
import {getAllTagsWithoutPagination} from "../../dao/tagDao";
import {getTag} from "../../dao/tagDao";
import {showResultToClient} from "../../utils/responseUtils";
import {getOrderByObject} from "../../utils/orderByManager";
import {isObjectId} from "../../utils/objectIdUtils";

var router = express.Router();

// Support api: /tags to get all tag with pagination info
// Support select tags by tag name, example /tags?tag_name=vật
router.get('/', getTagsRoute);

router.get('/without-pagination', getTagsWithoutPaginationRoute);

router.get('/:tag', getTagRoute);

/**
 * Get tag by Id or slug
 * @param req
 * @param res
 */
export function getTagRoute(req, res) {
    let tag = req.params.tag;
    let isValid = isObjectId(tag);
    let queryObj = isValid ? {_id: tag} : {slug: tag};
    getTag(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
}

/**
 *
 * @param req
 * @param res
 */
export function getTagsRoute(req, res) {
    let paginationInfo = req.query;
    let orderBy = getOrderByObject(req.query);
    let {keyword} = req.query;
    getAllTagsWithPagination(keyword, paginationInfo, orderBy, (err, data) => {
        showResultToClient(err, data, res);
    });
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function getTagsWithoutPaginationRoute(req, res, next) {
    let orderBy = getOrderByObject(req.query);
    getAllTagsWithoutPagination(orderBy, (err, data) => {
        showResultToClient(err, data, res);
    });
}

export default router;