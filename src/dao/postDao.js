/**
 * Created by Tien Nguyen on 11/18/16.
 */
import {Post} from '../models/index';
import Pagination from 'pagination-js';
import {saveTags} from "./tagDao";
import {getTagsByTagSlugs} from "./tagDao";


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
 * @param slug
 * @param callback
 */
function getPostBySlug(slug, callback) {
    Post.findOne({slug: slug})
        .populate({path: "tags"})
        .exec(callback);
}

/**
 * Query paginated Posts
 * @param query query Object
 * @param paginationInfo include item_per_page and page information to get pagination data
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
 * @param paginationInfo include itemPerPage and page information to get pagination data
 * @param callback
 */
function getAllPostsWithPagination(paginationInfo, callback) {
    let query = {};
    getPostsWithPagination(query, paginationInfo, callback);
}

/**
 *
 * @param keyword
 * @param paginationInfo
 * @param callback
 */
function searchPostsByKeyword(keyword, paginationInfo, callback) {
    let query = {$text: {$search: keyword}};
    getPostsWithPagination(query, paginationInfo, callback);
}

/**
 * Query paginated Posts by array of tag slug
 * @param keyword search keyword
 * @param tagSlugs array of tag slug
 * @param paginationInfo include item_per_page and page information to get pagination data
 * @param callback
 */
function getPostsByTagsWithPagination(keyword, tagSlugs, paginationInfo, callback) {
    (async() => {
        try {
            if (tagSlugs.length === 0 && keyword === "") {
                getAllPostsWithPagination(paginationInfo, callback);
            } else if (tagSlugs.length === 0 && keyword !== "") {
                searchPostsByKeyword(keyword, paginationInfo, callback);
            } else {
                let tags = await getTagsByTagSlugs(tagSlugs);
                let query = keyword !== "" ? {$and: [{tags: {$in: tags}}, {$text: {$search: keyword}}]}
                    : {tags: {$in: tags}};
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
            Object.assign(postData, {user: userId});
            let post = new Post(postData);
            post.save(callback);
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Update Post data
 * @param slug
 * @param postData
 * @param tags
 * @param callback
 */
function updatePost(slug, postData, tags, callback) {
    (async() => {
        try {
            let tagIds = await saveTags(tags);
            Object.assign(postData, {tags: tagIds});
            Post.findOneAndUpdate({slug: slug}, {$set: postData})
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
