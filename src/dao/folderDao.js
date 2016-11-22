import {Folder, File} from '../models';
import slug from 'slug';

export async function getFolders(userId){
    return Folder.find({}).exec();
}

export async function createFolder(name, userId){
    let check_folder_exists = await Folder.find({name, userId}).count();
    if(check_folder_exists) return false;
    let folder = new Folder({
        name,
        userId,
        slug: slug(name, '-')
    });
    folder = await folder.save();
    return folder;
}

export async function updateFolder(folderId, name, userId){
    let check_folder_exists = await Folder.find({name, userId}).count();
    if(check_folder_exists) return false;
    let folder = await Folder.findOneAndUpdate({_id: folderId}, {name}, {new: true}).exec();
    if(!folder) return false;
    return folder;
}

export async function getFolder(folderId){
    const folder = await Folder.findOne({_id: folderId});
    return folder;
}

export async function deleteFolder(folderId){
    Folder.remove({_id: folderId}).exec();
    File.remove({folderId: folderId}).exec();
}

export default {getFolders, getFolder, createFolder, updateFolder, deleteFolder}