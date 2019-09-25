import * as React from "react";
import { Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import Grow from "@material-ui/core/Grow";

const styles = (theme: Theme) =>
    createStyles({
        success: { justifyContent: "center", maxWidth: "100%", boxShadow: "none", width: "100%", borderRadius: "0px", padding: "0px" },
        error: { justifyContent: "center", maxWidth: "100%", boxShadow: "none", width: "100%", borderRadius: "0px", padding: "0px" },
        warning: { justifyContent: "center", maxWidth: "100%", boxShadow: "none", width: "100%", borderRadius: "0px", padding: "0px" },
        info: { backgroundColor: "#5E5E5E", justifyContent: "center", maxWidth: "100%", boxShadow: "none", width: "100%", borderRadius: "0px", padding: "0px" },
        root: {
            width: "100%",
            padding: "0px",
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
