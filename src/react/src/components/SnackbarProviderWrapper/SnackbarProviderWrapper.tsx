import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles, IconButton } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { removeSnackbar } from '../../redux/actions/SnackbarActions';
import { connect } from 'react-redux';
import CloseCircle from 'mdi-material-ui/CloseCircle';
import Constants from '../../theme/Constants';

const notistackStyle = (theme: Theme) => {
    return {
        // justifyContent: 'center',
        // maxWidth: '100%',
        // boxShadow: 'none',
        // width: '100%',
        borderRadius: '0px',
        fontSize: theme.typography.body1.fontSize,
        fontWeight: theme.typography.fontWeightRegular,
    };
};

const styles = (theme: Theme) =>
    createStyles({
        // snackContainer: {
        //     //     bottom: '0px !important',
        //     //     right: '0px !important',
        //     //     width: '100%',
        //     //     marginBottom: '-2px',
        //     textAlign: 'right',
        //     // '> div:nth-of-type(1)': {
        //     // padding: '0px !important',
        //     // },
        // },
        success: { ...notistackStyle(theme), backgroundColor: theme.palette.primary.main },
        error: { ...notistackStyle(theme), backgroundColor: theme.palette.error.main },
        info: { ...notistackStyle(theme), backgroundColor: '#2e2e2e' },
        warning: notistackStyle(theme),
    });

interface SnackbarProviderWrapperProps extends WithStyles<typeof styles> {
    removeSnackbar: (key: React.ReactText) => void;
}

class SnackbarProviderWrapper extends React.Component<SnackbarProviderWrapperProps> {
    snackbarProviderRef: React.RefObject<any> = React.createRef();
    onClickDismiss = (key: string | number) => () => {
        this.snackbarProviderRef.current.closeSnackbar(key);
        this.props.removeSnackbar(key);
    };
    render() {
        const { classes } = this.props;
        return (
            <SnackbarProvider
                ref={this.snackbarProviderRef}
                classes={{
                    // containerAnchorOriginBottomCenter: classes.snackContainer,
                    variantSuccess: classes.success,
                    variantError: classes.error,
                    variantWarning: classes.warning,
                    variantInfo: classes.info,
                }}
                action={(key) => (
                    <IconButton onClick={this.onClickDismiss(key)} aria-label="delete" size="small">
                        <CloseCircle htmlColor={Constants.COLORS.WHITE} fontSize="inherit" />
                    </IconButton>
                )}
                hideIconVariant={true}
                maxSnack={3}
                autoHideDuration={7000}
                // anchorOrigin={{
                //     vertical: 'bottom',
                //     horizontal: 'center',
                // }}
            >
                {this.props.children}
            </SnackbarProvider>
        );
    }
}

export default withStyles(styles, { withTheme: true })(connect(null, { removeSnackbar })(SnackbarProviderWrapper));
