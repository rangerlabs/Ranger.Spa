import * as React from "react";
import { Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";
import { SnackbarProvider } from "notistack";

const styles = (theme: Theme) =>
    createStyles({
        success: { justifyContent: "center", maxWidth: "100%", boxShadow: "none", width: "100%", height: theme.toolbar.height },
        error: { justifyContent: "center", maxWidth: "100%", boxShadow: "none", width: "100%", height: theme.toolbar.height },
        warning: { justifyContent: "center", maxWidth: "100%", boxShadow: "none", width: "100%", height: theme.toolbar.height },
        info: { justifyContent: "center", maxWidth: "100%", boxShadow: "none", width: "100%", height: theme.toolbar.height },
        root: {
            width: "100%",
            height: theme.toolbar.height,
        },
    });

interface SnackbarProviderWrapperProps extends WithStyles<typeof styles> {}

class SnackbarProviderWrapper extends React.Component<SnackbarProviderWrapperProps> {
    render() {
        const { classes } = this.props;
        return (
            <SnackbarProvider
                classes={{
                    root: classes.root,
                    variantSuccess: classes.success,
                    variantError: classes.error,
                    variantWarning: classes.warning,
                    variantInfo: classes.info,
                }}
                dense
                maxSnack={1}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                {this.props.children}
            </SnackbarProvider>
        );
    }
}

export default withStyles(styles, { withTheme: true })(SnackbarProviderWrapper);
