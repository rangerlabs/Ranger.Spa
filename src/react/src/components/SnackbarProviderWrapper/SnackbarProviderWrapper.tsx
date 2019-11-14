import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';

const notistackStyle = (theme: Theme) => {
    return {
        justifyContent: 'center',
        maxWidth: '100%',
        boxShadow: 'none',
        width: '100%',
        borderRadius: '0px',
        fontSize: theme.typography.h6.fontSize,
        fontWeight: theme.typography.fontWeightMedium,
    };
};

const styles = (theme: Theme) =>
    createStyles({
        snackContainer: {
            bottom: '0px !important',
            right: '0px !important',
            width: '100%',
            marginBottom: '-2px',
            textAlign: 'center',
            '> > div:nth-of-type(1)': {
                padding: '0px !important',
            },
        },
        success: { ...notistackStyle(theme), backgroundColor: theme.palette.primary.main },
        error: { ...notistackStyle(theme), backgroundColor: theme.palette.error.main },
        info: { ...notistackStyle(theme), backgroundColor: '#2e2e2e' },
        warning: notistackStyle(theme),
    });

interface SnackbarProviderWrapperProps extends WithStyles<typeof styles> {}

class SnackbarProviderWrapper extends React.Component<SnackbarProviderWrapperProps> {
    render() {
        const { classes } = this.props;
        return (
            <SnackbarProvider
                classes={{
                    containerAnchorOriginBottomCenter: classes.snackContainer,
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
