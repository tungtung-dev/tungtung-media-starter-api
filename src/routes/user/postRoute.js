/**
 * Created by Tien Nguyen on 11/18/16.
 */
import express from "express";
import {getPostBySlug, getPosts} from "dao/postDao";
import {postState} from "utils/constants";
import {showResultToClient} from "utils/responseUtils";
import {isObjectId} from "utils/objectIdUtils";
import {getOrderByObject} from "utils/orderByManager";

var route = express.Router();

route.get('/', (req, res) => {
    let {keyword, categoryId} = req.query;
    let tags = req.query.tags !== undefined ? req.query.tags.split(",") : [];
    let orderBy = getOrderByObject(req.query);
    getPosts(categoryId, keyword, tags, [postState.PUBLIC], req.query, orderBy, (err, data) => {
        showResultToClient(err, data, res);
    });
});

route.get('/:post', getPostBySlugOrIdRoute);

export function getPostBySlugOrIdRoute(req, res) {
    var {post} = req.params;
    let isValid = isObjectId(post);
    let queryObj = isValid ? {_id: post} : {slug: post};
    getPostBySlug(queryObj, (err, data) => {
        showResultToClient(err, data, res);
    });
}


export default route;
