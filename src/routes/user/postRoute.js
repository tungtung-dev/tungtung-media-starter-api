/**
 * Created by Tien Nguyen on 11/18/16.
 */
import express from "express";
import {getPostBySlug, getPostsByTagsWithPagination} from "../../dao/postDao";
import url from "url";
import {postState} from "../../utils/constants";
import {showResultToClient} from "../../utils/responseUtils";

var route = express.Router();

route.get('/', (req, res) => {
    let {keyword} = req.query;
    let tags = req.query.tags !== undefined ? req.query.tags.split(",") : [];
    getPostsByTagsWithPagination(keyword, tags, [postState.TRASH], query, (err, data) => {
        showResultToClient(err, data, res);
    });
});

route.get('/:postSlug', (req, res) => {
    var {postSlug} = req.params;
    getPostBySlug(postSlug, (err, data) => {
        showResultToClient(err, data, res);
    });
});


export default route;
