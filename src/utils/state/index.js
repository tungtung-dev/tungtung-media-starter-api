/**
 * Created by Tien Nguyen on 11/22/16.
 */
import {postState} from 'utils/constants';
import {Post} from 'models/index';


/**
 * Check input state and correct it
 * @param inputState
 * @returns {string}
 */
export function getCorrectState(inputState = postState.DRAFT) {
    switch (inputState) {
        case postState.DRAFT:
        case postState.PUBLIC:
        case postState.TRASH:
            return inputState;
        default:
            return postState.DRAFT;
    }
}

/**
 *
 * @param inputState
 * @param postQuery
 */
export async function getCorrectStateAsync(inputState = postState.DRAFT, postQuery) {
    let post = await Post.findOne(postQuery).exec();
    let state = postState.DRAFT;
    console.log("Post state = " + post.state);
    try {
        switch (inputState) {
            case postState.DRAFT:
            case postState.PUBLIC:
            case postState.TRASH:
                state = inputState;
                break;
            default:
                state = post.state;
        }
    } catch (err) {
        state = postState.DRAFT;
    }
    return new Promise((resolve, reject) => {
        resolve(state);
    });
}
