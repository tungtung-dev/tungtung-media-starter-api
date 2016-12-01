/**
 * Created by Tien Nguyen on 11/18/16.
 */
import {Post} from '../models/index';
import Pagination from 'pagination-js';
import {saveTags} from "./tagDao";
import {getTagsByTagSlugs} from "./tagDao";
import {postState} from "../utils/constants";

/**
 * Count Post by query
 * @param query
 * @param callback
 */
function countPosts(query, callback) {
    Post.count(query).exec(callback);
}

/**
 * Get Post with correct slug title
 * @param queryObj
 * @param callback
 */
function getPostBySlug(queryObj, callback) {
    Post.findOne(queryObj)
        .populate({path: "tags"})
        .exec(callback);
}

/**
 * Query paginated Posts
 * @param query query Object
 * @param paginationInfo include itemPerPage and page information to get pagination data
 * @param callback
 */
function getPostsWithPagination(query, paginationInfo, callback) {
    (async() => {
        try {
            let count = await Post.count(query).exec();
            let pagination = (new Pagination(paginationInfo, count)).getPagination();
            Post.find(query)
                .skip(pagination.minIndex)
                .limit(pagination.itemPerPage)
                .populate({path: "tags"})
                .populate({path: "owner", select: {password: 0}})
                .exec((err, data) => {
                    callback(err, {data, pagination});
                });
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Query paginated Posts
 * @param state
 * @param paginationInfo include itemPerPage and page information to get pagination data
 * @param callback
 */
function getAllPostsWithPagination(state = [postState.PUBLIC], paginationInfo, callback) {
    let query = {state: {$in: state}};
    getPostsWithPagination(query, paginationInfo, callback);
}

/**
 *
 * @param state
 * @param keyword
 * @param paginationInfo
 * @param callback
 */
function searchPostsByKeyword(state = [postState.PUBLIC], keyword = "", paginationInfo, callback) {
    let query = {$text: {$search: keyword}, state: {$in: state}};
    getPostsWithPagination(query, paginationInfo, callback);
}

/**
 * Query paginated Posts by array of tag slug
 * @param keyword search keyword
 * @param tags array of tag slug
 * @param state
 * @param paginationInfo include itemPerPage and page information to get pagination data
 * @param callback
 */
function getPostsByTagsWithPagination(keyword = "", tags = [], state = [postState.PUBLIC], paginationInfo, callback) {
    (async() => {
        try {
            if (tags.length === 0 && keyword === "") {
                getAllPostsWithPagination(state, paginationInfo, callback);
            } else if (tags.length === 0 && keyword !== "") {
                searchPostsByKeyword(state, keyword, paginationInfo, callback);
            } else {
                let tagIds = await getTagsByTagSlugs(tags);
                let query = keyword !== "" ? {$and: [{tags: {$in: tagIds}}, {$text: {$search: keyword}}, {state: {$in: state}}]}
                    : {tags: {$in: tagIds}, state: {$in: state}};
                getPostsWithPagination(query, paginationInfo, callback);
            }
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Save Post data
 * @param userId
 * @param postData
 * @param tags
 * @param callback
 */
function savePost(userId, postData, tags, callback) {
    (async() => {
        try {
            let tagIds = await saveTags(tags);
            Object.assign(postData, {tags: tagIds});
            Object.assign(postData, {owner: userId});
            let post = new Post(postData);
            await post.save();
            Post.populate(post, {path: 'tags owner', select: {password: 0}}, callback);
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Update Post data
 * @param userId
 * @param slug
 * @param postData
 * @param tags
 * @param callback
 */
function updatePost(userId, slug, postData, tags, callback) {
    (async() => {
        try {
            let tagIds = await saveTags(tags);
            Object.assign(postData, {tags: tagIds});
            Post.findOneAndUpdate({slug: slug, owner: userId}, {$set: postData}, {new: true})
                .populate({path: 'tags'})
                .populate({path: 'owner', select: {password: 0}})
                .exec(callback);
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Delete Post by slug
 * @param slug slug from request
 * @param callback
 */
function deletePostBySlug(slug, callback) {
    Post.findOneAndRemove({slug: slug})
        .exec(callback);
}

export {
    countPosts,
    getPostBySlug,
    getAllPostsWithPagination,
    getPostsWithPagination,
    savePost,
    deletePostBySlug,
    getPostsByTagsWithPagination,
    updatePost
}
export default {
    countPosts,
    getPostBySlug,
    getAllPostsWithPagination,
    getPostsWithPagination,
    savePost,
    deletePostBySlug,
    getPostsByTagsWithPagination,
    updatePost
}
