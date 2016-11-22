import Setting from '../models/setting';

export async function getKey(key){
    var value = Setting.findOne({key});
    if(!value) return {};
    return value;
}

export default {getKey}