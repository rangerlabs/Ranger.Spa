import createMuiTheme, { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

declare module "@material-ui/core/styles/createMuiTheme" {
    interface Theme {
        drawer: {
            width: React.CSSProperties["width"];
            text: {
                color: React.CSSProperties["color"];
            };
            enterDuration: number;
            leavingDuration: number;
        };
        toolbar: {
            height: number;
        };
        notistack: {
            width: React.CSSProperties["width"];
        };
    }
    interface ThemeOptions {
        drawer?: {
            width?: React.CSSProperties["width"];
            text?: {
                color: React.CSSProperties["color"];
            };
            enterDuration?: number;
            leavingDuration?: number;
        };
        toolbar?: {
            height?: number;
        };
        notistack?: {
            width: React.CSSProperties["width"];
        };
    }
}

export default function createRangerTheme(options: ThemeOptions) {
    const toolbarHeight = 64;
    return createMuiTheme({
        drawer: {
            width: 240,
            text: {
                color: "#FFFFFF",
            },
            enterDuration: 350,
            leavingDuration: 450,
        },
        toolbar: {
            height: toolbarHeight,
        },
        notistack: {
            width: "100%",
        },
        overrides: {
            MuiToolbar: {
                root: {
                    height: toolbarHeight,
                },
            },
        },
        ...options,
    });
}
