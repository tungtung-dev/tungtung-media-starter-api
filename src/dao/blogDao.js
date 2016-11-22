/**
 * Created by Tien Nguyen on 11/18/16.
 */
import {Blog} from '../models/index';
import Pagination from 'pagination-js';
import {saveTags} from "./tagDao";
import {getTagsByTagSlugs} from "./tagDao";


/**
 * Count blog by query
 * @param query
 * @param callback
 */
function countBlogs(query, callback) {
    Blog.count(query).exec(callback);
}

/**
 * Get blog with correct slug title
 * @param slug
 * @param callback
 */
function getBlogBySlug(slug, callback) {
    Blog.findOne({slug: slug})
        .populate({path: "tags"})
        .exec(callback);
}

/**
 * Query paginated Blogs
 * @param query query Object
 * @param paginationInfo include item_per_page and page information to get pagination data
 * @param callback
 */
function getBlogsWithPagination(query, paginationInfo, callback) {
    (async() => {
        try {
            let count = await Blog.count(query).exec();
            let pagination = (new Pagination(paginationInfo, count)).getPagination();
            Blog.find(query)
                .skip(pagination.min_index)
                .limit(pagination.item_per_page)
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
 * Query paginated Blogs
 * @param paginationInfo include item_per_page and page information to get pagination data
 * @param callback
 */
function getAllBlogsWithPagination(paginationInfo, callback) {
    let query = {};
    getBlogsWithPagination(query, paginationInfo, callback);
}

/**
 *
 * @param keyword
 * @param paginationInfo
 * @param callback
 */
function searchBlogsByKeyword(keyword, paginationInfo, callback) {
    let query = {$text: {$search: keyword}};
    getBlogsWithPagination(query, paginationInfo, callback);
}

/**
 * Query paginated Blogs by array of tag slug
 * @param keyword search keyword
 * @param tagSlugs array of tag slug
 * @param paginationInfo include item_per_page and page information to get pagination data
 * @param callback
 */
function getBlogsByTagsWithPagination(keyword, tagSlugs, paginationInfo, callback) {
    (async() => {
        try {
            if (tagSlugs.length === 0 && keyword === "") {
                getAllBlogsWithPagination(paginationInfo, callback);
            } else if (tagSlugs.length === 0 && keyword !== "") {
                searchBlogsByKeyword(keyword, paginationInfo, callback);
            } else {
                let tags = await getTagsByTagSlugs(tagSlugs);
                let query = keyword !== "" ? {$and: [{tags: {$in: tags}}, {$text: {$search: keyword}}]}
                    : {tags: {$in: tags}};
                getBlogsWithPagination(query, paginationInfo, callback);
            }
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Save Blog data
 * @param userId
 * @param blogData
 * @param tags
 * @param callback
 */
function saveBlog(userId, blogData, tags, callback) {
    (async() => {
        try {
            let tag_ids = await saveTags(tags);
            Object.assign(blogData, {tags: tag_ids});
            Object.assign(blogData, {user: userId});
            let blog = new Blog(blogData);
            blog.save(callback);
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Update Blog data
 * @param slug
 * @param blogData
 * @param tags
 * @param callback
 */
function updateBlog(slug, blogData, tags, callback) {
    (async() => {
        try {
            let tagIds = await saveTags(tags);
            Object.assign(blogData, {tags: tagIds});
            Blog.findOneAndUpdate({slug: slug}, {$set: blogData})
                .exec(callback);
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Delete blog by slug
 * @param slug slug from request
 * @param callback
 */
function deleteBlogBySlug(slug, callback) {
    Blog.findOneAndRemove({slug: slug})
        .exec(callback);
}

export {
    countBlogs,
    getBlogBySlug,
    getAllBlogsWithPagination,
    getBlogsWithPagination,
    saveBlog,
    deleteBlogBySlug,
    getBlogsByTagsWithPagination,
    updateBlog
}
export default {
    countBlogs,
    getBlogBySlug,
    getAllBlogsWithPagination,
    getBlogsWithPagination,
    saveBlog,
    deleteBlogBySlug,
    getBlogsByTagsWithPagination,
    updateBlog
}
