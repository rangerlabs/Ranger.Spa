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

export default function createRangerTheme(theme: ThemeOptions) {
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
            height: Constants.HEIGHT.TOOLBAR,
        },
        notistack: {
            width: '100%',
        },
        overrides: {
            MuiDialog: {
                paper: {
                    minWidth: '30%',
                },
            },
            MuiTable: {
                root: {
                    margin: '0px 16px',
                    width: `calc(100% - 32px)`,
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
            MuiTableCell: {
                root: {
                    fontSize: '1rem',
                    lineHeight: 1.5,
                    borderBottom: '0px',
                },
            },
            MuiBadge: {
                badge: {
                    right: -3,
                    border: `2px solid ${Constants.COLORS.WHITE}`,
                    padding: '0 4px',
                    borderRadius: '3px',
                },
            },
            MuiCard: {
                root: {
                    backgroundColor: Constants.COLORS.WHITE,
                },
            },
            MuiDrawer: {
                paperAnchorDockedLeft: {
                    borderRight: 'none',
                    boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
                },
            },
            MuiPaper: {
                rounded: {
                    borderRadius: '0px',
                },
            },
            MuiTouchRipple: {
                root: {
                    color: Constants.COLORS.PRIMARY_COLOR,
                },
            },
            MuiButton: {
                root: {
                    borderRadius: '0px',
                    '&:hover': {
                        backgroundColor: Constants.COLORS.MENU_BACKGROUND_COLOR,
                    },
                },
            },
            MuiInput: {
                underline: {
                    '&$disabled': {
                        '&:before': {
                            borderBottomStyle: 'none',
                        },
                    },
                },
            },
            MuiSnackbarContent: {
                action: {
                    marginLeft: '0px',
                    marginRight: '0px',
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
        ...theme,
    });
}
