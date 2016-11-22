/**
 * Created by Tien Nguyen on 11/22/16.
 */
import {postState} from "../constants";

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
