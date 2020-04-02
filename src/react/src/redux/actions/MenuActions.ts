export const EXPANDED_SECTION = 'EXPANDED_SECTION';

export interface MenuAction {
    type: string;
    menu: MenuState;
}

export interface MenuState {
    currentSelection: string;
}

export function expandSection(menu: MenuState): MenuAction {
    return {
        type: EXPANDED_SECTION,
        menu,
    };
}
