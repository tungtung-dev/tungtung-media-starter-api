import Setting from '../models/Setting';

export async function getKey(key){
    var value = Setting.findOne({key});
    if(!value) return {};
    return value;
}

export default {getKey}