import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import mime from "mime-types";

export function getDirectories(path_base) {
    return fs.readdirSync(path_base).filter(function (file) {
        return fs.statSync(path.join(path_base, file)).isDirectory();
    }).sort(function (a, b) {
        return fs.statSync(path_base + '/' + a).ctime.getTime() -
            fs.statSync(path_base + '/' + b).ctime.getTime();
    });
}

export function renameDirectory(old_directory, new_directory, callback) {
    fs.rename(old_directory, new_directory, callback);
}

export function deleteDirectory(directory, callback) {
    rimraf(directory, callback);
}

export function createDirectory(new_directory) {
    if (!fs.existsSync(new_directory)) {
        fs.mkdirSync(new_directory);
        return true;
    }
    return false;
}

export function getFileInDirectory(path_base, directory) {
    const new_path = path_base + '/' + directory;
    return new Promise((resolve, reject) => {
        try {
            fs.readdir(new_path, (err, files) => {
                if (!files) {
                    resolve([]);
                    return;
                }
                var new_files = files.filter(file => {
                    return fs.statSync(path.join(new_path, file)).isFile()
                }).map((file) => {
                    let file_info = fs.statSync(path.join(new_path, file));
                    return {
                        id: file,
                        name: file,
                        size: file_info.size,
                        type: mime.lookup(file),
                        created_at: file_info.ctime,
                        updated_at: file_info.mtime
                    }
                }).sort(function (file1, file2) {
                    return file1.created_at.getTime() - file2.created_at.getTime();
                });
                resolve(new_files);
            })
        } catch (e) {
            reject(e);
        }
    })
}

export function walkSync(path_base, filelist = [], folder_name, level = 1) {
    var files = fs.readdirSync(path_base);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(path_base, file)).isDirectory() && level < 2) {
            filelist = walkSync(path.join(path_base, file), filelist, file, level + 1);
        }
        else if(fs.statSync(path.join(path_base, file)).isFile()){
            let file_fs = fs.statSync(path.join(path_base, file));
            let file_info = {
                id: file,
                name: file,
                type: mime.lookup(file),
                folder_name: folder_name,
                size: file_fs.size,
                created_at: file_fs.ctime,
                updated_at: file_fs.mtime
            };
            filelist.push(file_info);
        }
    });
    return filelist.sort(function (file1, file2) {
        return file1.created_at.getTime() - file2.created_at.getTime();
    });
}

export default {
    getDirectories,
    createDirectory,
    getFileInDirectory,
    deleteDirectory,
    renameDirectory,
    walkSync
}