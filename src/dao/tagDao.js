/**
 * Created by Tien Nguyen on 11/18/16.
 */
import {Tag} from '../models/index';
import slug from 'slug';
import Pagination from 'pagination-js';

/**
 * Save new tag if it is not exist Async
 * @param tag
 * @returns {*}
 */
async function saveTagIfNeeded(tag) {
    let sluggedTag = slug(tag);
    try {
        await Tag.update({slug: sluggedTag}, {
            $set: {
                updatedAt: new Date()
            },
            $setOnInsert: {
                name: tag,
                slug: sluggedTag,
                createdAt: new Date()
            }
        }, {upsert: true}).exec();
        let result = await Tag.findOne({slug: sluggedTag}).exec();
        return result._id;
    } catch (err) {
        return null;
    }
}

export function saveTagIfNeededAsync(tag, callback) {
    let sluggedTag = slug(tag);
    Tag.findOneAndUpdate({slug: sluggedTag}, {
        $set: {
            updatedAt: new Date()
        },
        $setOnInsert: {
            name: tag,
            slug: sluggedTag,
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
 * @param callback
 */
function getTagsWithPagination(queryObj, paginationInfo, callback) {
    (async() => {
        try {
            let count = await Tag.count(queryObj).exec();
            let pagination = (new Pagination(paginationInfo, count)).getPagination();
            Tag.find(queryObj)
                .skip(pagination.minIndex)
                .limit(pagination.itemPerPage)
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
 * @param callback
 */
function getTagsWithoutPagination(queryObj, callback) {
    Tag.find(queryObj).exec(callback);
}

/**
 * Get all tag without pagination
 * @param callback
 */
export function getAllTagsWithoutPagination(callback) {
    getTagsWithoutPagination({}, callback);
}

/**
 * Get all tags with pagination
 * @param paginationInfo include item_per_page and page information to get pagination data
 * @param callback
 */
function getAllTagsWithPagination(paginationInfo, callback) {
    let queryObj = {};
    getTagsWithPagination(queryObj, paginationInfo, callback);
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
    let sluggedTag = slug(name);
    Tag.findOneAndUpdate(queryObj, {
        $set: {
            name: name,
            slug: sluggedTag,
            updatedAt: new Date()
        },
        $setOnInsert: {
            createdAt: new Date()
        }
    }, {upsert: true, new: true}).exec(callback);
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