/**
 * Created by Tien Nguyen on 11/28/16.
 */
import express from "express";
import {
    editPostMiddleware,
    deletePostMiddleware,
    createPostMiddleware,
    viewPostMiddleware
} from "../../../middlewares/admin/post";
import {
    deletePostBySlug,
    updatePost,
    savePost,
    getPostsByTagsWithPagination,
    getPostBySlug
} from "../../../dao/postDao";
import {getCorrectState} from "../../../utils/state/index";
import slug from "slug";
import {makeId} from "common-helper";
import {postState} from "../../../utils/constants";
import {isJsonString} from "common-helper";

var route = express.Router();

route.get('/', viewPostMiddleware, (req, res) => {
    let query = req.query;
    let tagSlugs = query.tagSlugs !== undefined ? query.tagSlugs.split(',') : [];
    let states = query.states !== undefined ? query.states.split(',') : [postState.PUBLIC, postState.DRAFT, postState.TRASH];
    getPostsByTagsWithPagination(query.keyword, tagSlugs, states, query, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.post('/', createPostMiddleware, (req, res) => {
    let tags = req.body.tags === undefined ? [] : req.body.tags;
    let title = req.body.title === undefined ? 'untitled' : req.body.title;
    let slugTitle = slug(title) + '-' + makeId();
    let searchField = slug(title);
    let {secondaryFeaturedImage, featuredImage, description} = req.body;

    let content = req.body.content !== undefined ? isJsonString(req.body.content) ? JSON.parse(req.body.content) : req.body.content : {};
    let customField = req.body.customField !== undefined ? isJsonString(req.body.customField) ? JSON.parse(req.body.customField) : req.body.customField : {};
    let state = getCorrectState(req.body.state);
    let data = {
        title: title,
        slug: slugTitle,
        description: description,
        content: content,
        searchField: searchField,
        state: state,
        secondaryFeaturedImage: secondaryFeaturedImage,
        featuredImage: featuredImage,
        customField: customField
    };
    savePost(req.user._id, data, tags, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? 'Not found' : err.message});
        } else {
            res.json(data);
        }
    })
});

route.get('/:postSlug', (req, res) => {
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
    let {description, secondaryFeaturedImage, featuredImage} = req.body;
    let searchField = slug(title, " ");
    let state = getCorrectState(req.body.state);
    let content = req.body.content !== undefined ? isJsonString(req.body.content) ? JSON.parse(req.body.content) : req.body.content : {};
    let customField = req.body.customField !== undefined ? isJsonString(req.body.customField) ? JSON.parse(req.body.customField) : req.body.customField : {};
    let data = {
        title: title,
        description: description,
        content: content,
        searchField: searchField,
        state: state,
        secondaryFeaturedImage: secondaryFeaturedImage,
        featuredImage: featuredImage,
        customField: customField,
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
