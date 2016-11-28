/**
 * Created by Tien Nguyen on 11/18/16.
 */
import express from "express";
import {getPostBySlug, getPostsByTagsWithPagination} from "../../dao/postDao";
import url from "url";
import {postState} from "../../utils/constants";
import {viewPostMiddleware} from "../../middlewares/admin/post";

var route = express.Router();

route.get('/', (req, res) => {
    let urlParts = url.parse(req.url, true);
    let query = urlParts.query;
    let tagSlugs = query.tagSlugs !== undefined ? query.tagSlugs.split(",") : [];
    getPostsByTagsWithPagination(query.keyword, tagSlugs, [postState.PUBLIC], query, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.get('/:postSlug', viewPostMiddleware, (req, res) => {
    var {postSlug} = req.params;
    getPostBySlug(postSlug, (err, data) => {
        if (err || data === null) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});


export default route;
