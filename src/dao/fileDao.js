import File from "../models/file";
import mediaUtils from "../utils/mediaUtils";

export async function getFiles(folderId, userId, username){
    let query = {userId};
    if(folderId) query = {...query, folderId};
    const photos = await File.find(query).sort({created_at: -1}).exec();
    return photos.map(
        file => mediaUtils.getFileDetail(file, username)
    )
}

export async function getFile(fileId){
    return File.findOne({_id: fileId});
}

export async function deleteFile(fileId){
    File.remove({_id: fileId}).exec();
}

export async function saveFile(file_info){
    let photo = new File(file_info);
    return photo.save();
}

export async function reset(){
    File.find({}).delete().exec();
}

export default {getFile, getFiles, saveFile, deleteFile, reset}
