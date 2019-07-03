import { MenuAction, EXPANDED_SECTION } from "../actions/MenuActions";

export function menuReducer(state: string = "", action: MenuAction) {
    switch (action.type) {
        case EXPANDED_SECTION:
            return action.menu;
        default:
            return state;
    }
}
