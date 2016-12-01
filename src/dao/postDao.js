/**
 * Created by Tien Nguyen on 11/18/16.
 */
import {Post, Category} from "models/index";
import Pagination from "pagination-js";
import {saveTags, getTagsByTagSlugs} from "./tagDao";
import {postState} from "utils/constants";
import {isObjectId} from "utils/objectIdUtils";

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
        .populate({path: "owner", select: {password: 0}})
        .exec(callback);
}

/**
 * Query paginated Posts
 * @param query query Object
 * @param paginationInfo include itemPerPage and page information to get pagination data
 * @param orderBy
 * @param callback
 */
function getPostsWithPagination(query, paginationInfo, orderBy, callback) {
    (async() => {
        try {
            let count = await Post.count(query).exec();
            let pagination = (new Pagination(paginationInfo, count)).getPagination();
            Post.find(query)
                .skip(pagination.minIndex)
                .limit(pagination.itemPerPage)
                .populate({path: "tags"})
                .populate({path: "owner", select: {password: 0}})
                .sort(orderBy)
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
 * @param orderBy
 * @param callback
 */
function getAllPostsWithPagination(state = [postState.PUBLIC], paginationInfo, orderBy = {createdAt: -1}, callback) {
    let query = {state: {$in: state}};
    getPostsWithPagination(query, paginationInfo, orderBy, callback);
}

/**
 *
 * @param state
 * @param keyword
 * @param paginationInfo
 * @param orderBy
 * @param callback
 */
function searchPostsByKeyword(state = [postState.PUBLIC], keyword = "", paginationInfo, orderBy = {createdAt: -1}, callback) {
    let query = {$text: {$search: keyword}, state: {$in: state}};
    getPostsWithPagination(query, paginationInfo, orderBy, callback);
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

export function getPosts(category = "", keyword = "", tags = [], state = [postState.PUBLIC], paginationInfo, orderBy = {createdAt: -1}, callback) {
    (async() => {
        try {
            let query = {};
            if (tags.length === 0 && keyword === "") {
                query = {state: {$in: state}};
            } else if (tags.length === 0 && keyword !== "") {
                query = {$text: {$search: keyword}, state: {$in: state}};
            } else {
                let tagIds = await getTagsByTagSlugs(tags);
                query = keyword !== "" ? {$and: [{tags: {$in: tagIds}}, {$text: {$search: keyword}}, {state: {$in: state}}]}
                    : {tags: {$in: tagIds}, state: {$in: state}};
            }
            if (category !== "") {
                let cateQuery = isObjectId(category) ? {_id: category} : {slug: category};
                try {
                    let categoryObj = await Category.findOne(cateQuery).exec();
                    Object.assign(query, {categoryId: categoryObj._id});
                } catch (err) {
                    console.log("Not find category");
                }
            }
            getPostsWithPagination(query, paginationInfo, orderBy, callback);
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
            let categoryCount = await Category.count({_id: postData.categoryId}).exec();
            if (categoryCount > 0) {
                let tagIds = await saveTags(tags);
                Object.assign(postData, {tags: tagIds});
                Object.assign(postData, {owner: userId});
                let post = new Post(postData);
                await post.save();
                Post.populate(post, {path: 'tags owner', select: {password: 0}}, callback);
            } else {
                callback(new Error('Please check the categoryId field'));
            }

        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Update Post data
 * @param queryObj
 * @param postData
 * @param tags
 * @param callback
 */
function updatePost(queryObj, postData, tags, callback) {
    (async() => {
        try {
            let categoryCount = await Category.count({_id: postData.categoryId}).exec();
            console.log("categoryCount " + categoryCount);
            if (categoryCount > 0) {
                let tagIds = await saveTags(tags);
                Object.assign(postData, {tags: tagIds});
                Post.findOneAndUpdate(queryObj, {$set: postData}, {new: true})
                    .populate({path: 'tags'})
                    .populate({path: 'owner', select: {password: 0}})
                    .exec(callback);
            } else {
                callback(new Error('Please check the categoryId field'));
            }
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
