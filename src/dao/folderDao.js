import {Folder, File} from '../models';
import slug from 'slug';

export async function getFolders(user_id){
    return Folder.find({}).exec();
}

export async function createFolder(name, user_id){
    let check_folder_exists = await Folder.find({name, user_id}).count();
    if(check_folder_exists) return false;
    let folder = new Folder({
        name,
        user_id,
        slug: slug(name, '-')
    });
    folder = await folder.save();
    return folder;
}

export async function updateFolder(folder_id, name, user_id){
    let check_folder_exists = await Folder.find({name, user_id}).count();
    if(check_folder_exists) return false;
    let folder = await Folder.findOneAndUpdate({_id: folder_id}, {name}, {new: true}).exec();
    if(!folder) return false;
    return folder;
}

export async function getFolder(folder_id){
    const folder = await Folder.findOne({_id: folder_id});
    return folder;
}

export async function deleteFolder(folder_id){
    Folder.remove({_id: folder_id}).exec();
    File.remove({folder_id: folder_id}).exec();
}

export default {getFolders, getFolder, createFolder, updateFolder, deleteFolder}