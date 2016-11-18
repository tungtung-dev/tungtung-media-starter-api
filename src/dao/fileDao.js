import File from "../models/file";
import mediaUtils from "../utils/mediaUtils";

export async function getFiles(folder_id, user_id, username){
    let query = {user_id};
    if(folder_id) query = {...query, folder_id};
    const photos = await File.find(query).sort({created_at: -1}).exec();
    return photos.map(
        file => mediaUtils.getFileDetail(file, username)
    )
}

export async function getFile(file_id){
    return File.findOne({_id: file_id});
}

export async function deleteFile(file_id){
    File.remove({_id: file_id}).exec();
}

export async function saveFile(file_info){
    let photo = new File(file_info);
    return photo.save();
}

export async function reset(){
    File.find({}).delete().exec();
}

export default {getFile, getFiles, saveFile, deleteFile, reset}
