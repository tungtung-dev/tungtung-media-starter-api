/**
 * Created by Tien Nguyen on 8/7/16.
 */

import express from "express";
import {getAllTagsWithPagination} from "../../dao/tagDao";
import url from 'url';

var router = express.Router();

// Support api: /tags to get all tag with pagination info
// Support select tags by tag name, example /tags?tag_name=vật
router.get('/', function (req, res, next) {
    let urlParts = url.parse(req.url, true);
    let paginationInfo = urlParts.query;
    getAllTagsWithPagination(paginationInfo, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

export default router;