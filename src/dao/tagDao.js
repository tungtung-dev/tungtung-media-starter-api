/**
 * Created by Tien Nguyen on 11/18/16.
 */
import {Tag, Post} from '../models/index';
import slug from 'slug';
import Pagination from 'pagination-js';

/**
 * Save new tag if it is not exist Async
 * @param tag
 * @returns {*}
 */
async function saveTagIfNeeded(tag) {
    tag = tag.toLowerCase();
    let sluggedTag = slug(tag);
    let searchField = slug(tag, ' ');
    try {
        await Tag.update({slug: sluggedTag}, {
            $set: {
                updatedAt: new Date()
            },
            $setOnInsert: {
                name: tag,
                slug: sluggedTag,
                searchField: searchField,
                createdAt: new Date()
            }
        }, {upsert: true}).exec();
        let result = await Tag.findOne({slug: sluggedTag}).exec();
        return result._id;
    } catch (err) {
        return null;
    }
}

/**
 *
 * @param tag
 * @param callback
 */
export function saveTagIfNeededAsync(tag, callback) {
    tag = tag.toLowerCase();
    let sluggedTag = slug(tag);
    let searchField = slug(tag, ' ');
    Tag.findOneAndUpdate({slug: sluggedTag}, {
        $set: {
            updatedAt: new Date()
        },
        $setOnInsert: {
            name: tag,
            slug: sluggedTag,
            searchField: searchField,
            createdAt: new Date()
        }
    }, {upsert: true, new: true}).exec(callback);
}

/**
 * Save Array of Tag
 * @param tags
 * @returns {Array}
 */
async function saveTags(tags) {
    let tagIds = [];
    for (let i = 0; i < tags.length; i++) {
        let tagId = await saveTagIfNeeded(tags[i]);
        if (tagId !== null) {
            tagIds.push(tagId);
        }
    }
    return tagIds;
}

/**
 * Get tags with pagination by query
 * @param queryObj query object: ex: {}, {_id: "123"}
 * @param paginationInfo include item_per_page and page information to get pagination data
 * @param orderByObj
 * @param callback
 */
function getTagsWithPagination(queryObj, paginationInfo, orderByObj, callback) {
    (async() => {
        try {
            let count = await Tag.count(queryObj).exec();
            let pagination = (new Pagination(paginationInfo, count)).getPagination();
            Tag.find(queryObj)
                .skip(pagination.minIndex)
                .limit(pagination.itemPerPage)
                .sort(orderByObj)
                .exec((err, data) => {
                    callback(err, {data, pagination});
                });
        } catch (err) {
            callback(err);
        }
    })();
}

/**
 * Get tags without pagination by query
 * @param queryObj
 * @param orderByObj
 * @param callback
 */
function getTagsWithoutPagination(queryObj, orderByObj, callback) {
    Tag.find(queryObj)
        .sort(orderByObj)
        .exec(callback);
}

/**
 * Get all tag without pagination
 * @param orderByObj
 * @param callback
 */
export function getAllTagsWithoutPagination(orderByObj, callback) {
    getTagsWithoutPagination({}, orderByObj, callback);
}

/**
 * Get all tags with pagination
 * @param keyword
 * @param paginationInfo include item_per_page and page information to get pagination data
 * @param orderByObj
 * @param callback
 */
function getAllTagsWithPagination(keyword = '', paginationInfo, orderByObj, callback) {
    let queryObj = keyword === '' ? {} : {$text: {$search: keyword}};
    getTagsWithPagination(queryObj, paginationInfo, orderByObj, callback);
}

/**
 * getTagsByTagSlugs
 * @param tags
 * @returns {Promise}
 */
async function getTagsByTagSlugs(tags) {
    // console.log("tagSlugs: " + tags.length);
    let tagSlugs = tags.map(tag => {
        return slug(tag);
    });
    console.log("tagSlugs: " + tags.length);
    return await Tag.find({slug: {$in: tagSlugs}}).exec();
}

/**
 * Update tag by Admin
 * @param queryObj
 * @param name
 * @param callback
 */
export function updateTag(queryObj, name, callback) {
    name = name.toLowerCase();
    let sluggedTag = slug(name);
    let searchField = slug(name, ' ');
    Tag.findOneAndUpdate(queryObj, {
        $set: {
            name: name,
            slug: sluggedTag,
            searchField: searchField,
            updatedAt: new Date()
        },
        $setOnInsert: {
            createdAt: new Date()
        }
    }, {upsert: true, new: true}).exec(callback);
}

/**
 * Delete tag and remove it from posts
 * @param queryObj
 * @param callback
 */
export function deleteTag(queryObj, callback) {
    Tag.findOneAndRemove(queryObj).exec((err, tag) => {
        if (err || tag === null) {
            callback(err ? err : new Error("Not find tag"));
        } else {
            //, {$set: {$pull: tag._id}}, {multi: true}
            Post.update({tags: tag._id}, {$pull: {tags: tag._id}}, {multi: true})
                .exec((err, post) => {
                    callback(null, {tag, post});
                })
        }
    });
}

/**
 * Get tag by query
 * @param queryObj
 * @param callback
 */
export function getTag(queryObj, callback) {
    Tag.findOne(queryObj).exec(callback);
}

export {saveTagIfNeeded, saveTags, getAllTagsWithPagination, getTagsByTagSlugs}
export default {saveTagIfNeeded, saveTags, getAllTagsWithPagination, getTagsByTagSlugs}