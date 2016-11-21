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
 * @param pagination_info include item_per_page and page information to get pagination data
 * @param callback
 */
function getBlogsWithPagination(query, pagination_info, callback) {
    (async() => {
        try {
            let count = await Blog.count(query).exec();
            let pagination = (new Pagination(pagination_info, count)).getPagination();
            Blog.find(query)
                .skip(pagination.min_index)
                .limit(pagination.item_per_page)
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
 * @param pagination_info include item_per_page and page information to get pagination data
 * @param callback
 */
function getAllBlogsWithPagination(pagination_info, callback) {
    let query = {};
    getBlogsWithPagination(query, pagination_info, callback);
}

/**
 * Query paginated Blogs by array of tag slug
 * @param tag_slugs array of tag slug
 * @param pagination_info include item_per_page and page information to get pagination data
 * @param callback
 */
function getBlogsByTagsWithPagination(tag_slugs, pagination_info, callback) {
    (async() => {
        try {
            if (tag_slugs.length === 0) {
                getAllBlogsWithPagination(pagination_info, callback);
            } else {
                let tags = await getTagsByTagSlugs(tag_slugs);
                let query = {tags: {$in: tags}};
                getBlogsWithPagination(query, pagination_info, callback);
            }
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Save Blog data
 * @param user_id
 * @param blog_data
 * @param tags
 * @param callback
 */
function saveBlog(user_id, blog_data, tags, callback) {
    (async() => {
        try {
            let tag_ids = await saveTags(tags);
            Object.assign(blog_data, {tags: tag_ids});
            Object.assign(blog_data, {user: user_id});
            let blog = new Blog(blog_data);
            blog.save(callback);
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
    getBlogsByTagsWithPagination
}
export default {
    countBlogs,
    getBlogBySlug,
    getAllBlogsWithPagination,
    getBlogsWithPagination,
    saveBlog,
    deleteBlogBySlug,
    getBlogsByTagsWithPagination
}
