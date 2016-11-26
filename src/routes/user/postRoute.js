/**
 * Created by Tien Nguyen on 11/18/16.
 */
import express from "express";
import {getPostBySlug, savePost, deletePostBySlug, getPostsByTagsWithPagination, updatePost} from "../../dao/postDao";
import url from "url";
import slug from "slug";
import {makeId} from "common-helper";
import {getCorrectState} from "../../utils/state/index";
import {postState} from "../../utils/constants";
import {createPostMiddleware, editPostMiddleware, deletePostMiddleware} from "../../middlewares/admin/post";
import {viewPostMiddleware} from "../../middlewares/admin/post";

var route = express.Router();

route.get('/', viewPostMiddleware, (req, res) => {
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

route.post('/', createPostMiddleware, (req, res) => {
    let tags = req.body.tags === undefined ? [] : req.body.tags;
    let title = req.body.title === undefined ? "untitled" : req.body.title;
    let slugTitle = slug(req.body.title) + "-" + makeId();
    let searchField = slug(req.body.title);
    let description = req.body.description;
    let content = req.body.content;
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
