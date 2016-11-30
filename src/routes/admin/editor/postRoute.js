/**
 * Created by Tien Nguyen on 11/28/16.
 */
import express from "express";
import {
    deletePostBySlug,
    updatePost,
    savePost,
    getPostsByTagsWithPagination,
    getPostBySlug
} from "../../../dao/postDao";
import slug from "slug";
import {makeId, convertData} from "common-helper";
import {postState} from "../../../utils/constants";
import {
    viewPostMiddleware,
    createPostMiddleware,
    editPostMiddleware,
    deletePostMiddleware
} from "../../../middlewares/admin/post";
import {getCorrectState} from "../../../utils/state/index";

var route = express.Router();

route.get('/', viewPostMiddleware, (req, res) => {
    let query = req.query;
    let tags = query.tags !== undefined ? query.tags.split(',') : [];
    let states = query.state !== undefined ? query.state.split(',') : [postState.PUBLIC, postState.DRAFT, postState.TRASH];
    getPostsByTagsWithPagination(query.keyword, tags, states, query, (err, data) => {
        if (err) {
            res.json({success: false, message: err === null ? "Not found" : err.message});
        } else {
            res.json(data);
        }
    });
});

route.post('/', createPostMiddleware, (req, res) => {
    let tags = req.body.tags === undefined ? [] : req.body.tags;
    let state = getCorrectState(req.body.state);
    let data = convertData(req.body, {
        title: {$get: true, $default: 'untitled'},
        description: {$get: true},
        content: {$get: true},
        state: {$set: state},
        featuredImage: {$get: true},
        secondaryFeaturedImage: {$get: true},
        customField: {$get: true},
        searchField: {
            $update: (value, objectData) => {
                return slug(objectData.title, ' ');
            }
        },
        slug: {
            $update: (value, objectData) => {
                return slug(objectData.title) + '-' + makeId();
            }
        }
    });
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
    let state = getCorrectState(req.body.state);
    let data = convertData(req.body, {
        title: {$get: true, $default: 'untitled'},
        description: {$get: true},
        content: {$get: true},
        state: {$set: state},
        featuredImage: {$get: true},
        secondaryFeaturedImage: {$get: true},
        customField: {$get: true},
        searchField: {
            $update: (tags, objectData) => {
                return slug(objectData.title, ' ');
            }
        }
    });
    updatePost(req.user._id, postSlug, data, tags, (err, data) => {
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
