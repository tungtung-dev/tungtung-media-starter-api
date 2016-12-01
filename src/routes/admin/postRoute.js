/**
 * Created by Tien Nguyen on 11/28/16.
 */
import express from "express";
import {deletePostBySlug, updatePost, savePost, getPosts} from "dao/postDao";
import slug from "slug";
import {makeId, convertData} from "common-helper";
import {postState} from "utils/constants";
import {
    viewPostMiddleware,
    createPostMiddleware,
    editPostMiddleware,
    deletePostMiddleware
} from "middlewares/admin/post";
import {getCorrectState} from "utils/state/index";
import {showResultToClient} from "utils/responseUtils";
import {getPostBySlugOrIdRoute} from "routes/user/postRoute";
import {isObjectId} from "../../utils/objectIdUtils";
import {getCorrectStateAsync} from "../../utils/state/index";
import {getOrderByObject} from "../../utils/orderByManager";

var route = express.Router();

route.get('/', viewPostMiddleware, (req, res) => {
    let query = req.query;
    let {categoryId} = query;
    let tags = query.tags !== undefined ? query.tags.split(',') : [];
    let states = query.state !== undefined ? query.state.split(',') : [postState.PUBLIC, postState.DRAFT, postState.TRASH];
    let orderBy = getOrderByObject(req.query);
    getPosts(categoryId, query.keyword, tags, states, query, orderBy, (err, data) => {
        showResultToClient(err, data, res);
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
        categoryId: {$get: true},
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
        showResultToClient(err, data, res);
    })
});

route.get('/:postSlug', getPostBySlugOrIdRoute);

route.put('/:postSlug', editPostMiddleware, (req, res) => {
    (async() => {
        var {postSlug} = req.params;
        let tags = req.body.tags === undefined ? [] : req.body.tags;
        let isValid = isObjectId(postSlug);
        let queryObj = isValid ? {_id: postSlug, owner: req.user._id} : {slug: postSlug, owner: req.user._id};
        let state = await getCorrectStateAsync(req.body.state);
        let data = convertData(req.body, {
            title: {$get: true},
            description: {$get: true},
            content: {$get: true},
            state: {$set: state},
            featuredImage: {$get: true},
            secondaryFeaturedImage: {$get: true},
            customField: {$get: true},
            categoryId: {$get: true},
            searchField: {
                $update: (value, objectData) => {
                    return objectData.title ? slug(objectData.title, ' ') : value;
                }
            }
        });
        updatePost(queryObj, data, tags, (err, data) => {
            showResultToClient(err, data, res);
        });
    })();
});

route.delete('/:postSlug', deletePostMiddleware, (req, res) => {
    var {postSlug} = req.params;
    deletePostBySlug(postSlug, (err, data) => {
        showResultToClient(err, data, res);
    });
});

export default route;
