import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import Constants from './Constants';

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        drawer: {
            width: React.CSSProperties['width'];
            text: {
                color: React.CSSProperties['color'];
            };
            enterDuration: number;
            leavingDuration: number;
        };
        toolbar: {
            height: number;
        };
        notistack: {
            width: React.CSSProperties['width'];
        };
    }
    interface ThemeOptions {
        drawer?: {
            width?: React.CSSProperties['width'];
            text?: {
                color: React.CSSProperties['color'];
            };
            enterDuration?: number;
            leavingDuration?: number;
        };
        toolbar?: {
            height?: number;
        };
        notistack?: {
            width: React.CSSProperties['width'];
        };
    }
}

export default function createRangerTheme(options: ThemeOptions) {
    const toolbarHeight = 64;
    return createMuiTheme({
        drawer: {
            width: 240,
            text: {
                color: Constants.COLORS.BLACK,
            },
            enterDuration: 350,
            leavingDuration: 450,
        },
        toolbar: {
            height: toolbarHeight,
        },
        notistack: {
            width: '100%',
        },
        overrides: {
            MuiToolbar: {
                root: {
                    height: toolbarHeight,
                    backgroundColor: Constants.COLORS.WHITE,
                },
            },
            MuiTouchRipple: {
                root: {
                    color: Constants.COLORS.PRIMARY_COLOR,
                },
            },
            MuiButton: {
                root: {
                    '&:hover': {
                        backgroundColor: Constants.COLORS.MENU_BACKGROUND_COLOR,
                    },
                },
            },
            MuiAppBar: {
                root: {
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                },
            },
            MuiTableRow: {
                root: {
                    //https://github.com/gregnb/mui-datatables/issues/748#issuecomment-524245251
                    '&$hover:hover': {
                        backgroundColor: Constants.COLORS.LIST_TABLE_HOVER_COLOR,
                    },
                },
            },
            MuiListItem: {
                button: {
                    '&:hover': {
                        backgroundColor: Constants.COLORS.LIST_TABLE_HOVER_COLOR,
                    },
                },
            },
            MuiListItemIcon: {
                root: {
                    color: Constants.COLORS.PRIMARY_COLOR,
                },
            },
        },
        ...options,
    });
}
