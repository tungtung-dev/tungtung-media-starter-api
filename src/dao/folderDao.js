import {Folder, File} from '../models';
import slug from 'slug';

/**
 *
 * @param userId
 * @returns {Promise}
 */
export async function getFolders(userId){
    return Folder.find({_id: userId}).exec();
}

/**
 *
 * @param name
 * @param userId
 * @returns {*}
 */
export async function createFolder(name, userId){
    let checkFolderExists = await Folder.find({name, userId}).count();
    if(checkFolderExists) return false;
    let folder = new Folder({
        name,
        userId,
        slug: slug(name, '-')
    });
    folder = await folder.save();
    return folder;
}

/**
 *
 * @param folderId
 * @param name
 * @param userId
 * @returns {*}
 */
export async function updateFolder(folderId, name, userId){
    let checkFolderExists = await Folder.find({name, userId}).count();
    if(checkFolderExists) return false;
    let folder = await Folder.findOneAndUpdate({_id: folderId}, {name}, {new: true}).exec();
    if(!folder) return false;
    return folder;
}

/**
 *
 * @param folderId
 * @returns {Promise}
 */
export async function getFolder(folderId){
    return await Folder.findOne({_id: folderId}).exec();
}

/**
 * 
 * @param folderId
 */
export async function deleteFolder(folderId){
    Folder.remove({_id: folderId}).exec();
    File.remove({folderId: folderId}).exec();
}

export default {getFolders, getFolder, createFolder, updateFolder, deleteFolder}