import { MenuAction, EXPANDED_SECTION, MenuState } from '../actions/MenuActions';

export function menuReducer(state = {} as MenuState, action: MenuAction) {
    switch (action.type) {
        case EXPANDED_SECTION:
            return Object.assign({}, action.menu);
        default:
            return state;
    }
}
