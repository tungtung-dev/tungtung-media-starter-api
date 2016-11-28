/**
 * Created by Tien Nguyen on 11/28/16.
 */
import express from "express";
import {editPostMiddleware} from "../../../middlewares/admin/post";
import {deletePostMiddleware} from "../../../middlewares/admin/post";
import {deletePostBySlug} from "../../../dao/postDao";
import {updatePost} from "../../../dao/postDao";
import {createPostMiddleware} from "../../../middlewares/admin/post";
import {savePost} from "../../../dao/postDao";
import {getCorrectState} from "../../../utils/state/index";
import {viewPostMiddleware} from "../../../middlewares/admin/post";
import {getPostsByTagsWithPagination} from "../../../dao/postDao";
import {postState} from "../../../utils/constants";
import slug from 'slug';
import url from 'url';
import {makeId} from "common-helper";

var route = express.Router();

route.get('/', viewPostMiddleware, (req, res) => {
    let urlParts = url.parse(req.url, true);
    let query = urlParts.query;
    let tagSlugs = query.tagSlugs !== undefined ? query.tagSlugs.split(",") : [];
    getPostsByTagsWithPagination(query.keyword, tagSlugs, [postState.PUBLIC, postState.DRAFT, postState.TRASH], query, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.post('/', createPostMiddleware, (req, res) => {
    let tags = req.body.tags === undefined ? [] : req.body.tags;
    let title = req.body.title === undefined ? "untitled" : req.body.title;
    let slugTitle = slug(title) + "-" + makeId();
    let searchField = slug(title);
    let description = req.body.description;

    let content = req.body.content !== undefined ? JSON.parse(req.body.content) : {};
    let state = getCorrectState(req.body.state);
    let data = {
        title: title, slug: slugTitle, description: description, content: content, searchField: searchField,
        state: state
    };
    savePost(req.user._id, data, tags, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    })
});

route.put('/:postSlug', editPostMiddleware, (req, res) => {
    var {postSlug} = req.params;
    let tags = req.body.tags === undefined ? [] : req.body.tags;
    let title = req.body.title === undefined ? "untitled" : req.body.title;
    let description = req.body.description;
    let searchField = slug(req.body.title, " ");
    let content = req.body.content;
    let state = getCorrectState(req.body.state);
    let data = {
        title: title,
        description: description,
        content: content,
        searchField: searchField,
        state: state,
        updatedAt: new Date()
    };
    updatePost(postSlug, data, tags, (err, data) => {
        if (err || data === null) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.delete('/:postSlug', deletePostMiddleware, (req, res) => {
    var {postSlug} = req.params;
    deletePostBySlug(postSlug, (err, data) => {
        if (err || data === null) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

export default route;
