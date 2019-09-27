import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';

const notistackStyle = (theme: Theme) => {
    return {
        justifyContent: 'center',
        maxWidth: '100%',
        boxShadow: 'none',
        width: '100%',
        // borderRadius: '0px',
        fontSize: theme.typography.fontSize,
        fontWeight: theme.typography.fontWeightMedium,
    };
};

const styles = (theme: Theme) =>
    createStyles({
        success: notistackStyle(theme),
        error: notistackStyle(theme),
        warning: notistackStyle(theme),
        info: { ...notistackStyle(theme), backgroundColor: theme.palette.primary.main },
        root: {
            width: '100%',
            padding: '0px',
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
                preventDuplicate={true}
                hideIconVariant={true}
                dense
                maxSnack={1}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                {this.props.children}
            </SnackbarProvider>
        );
    }
}

export default withStyles(styles, { withTheme: true })(SnackbarProviderWrapper);
