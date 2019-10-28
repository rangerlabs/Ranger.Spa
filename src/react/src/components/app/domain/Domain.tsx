import * as React from 'react';
import { withStyles, createStyles, WithStyles, Paper, CssBaseline, Theme, Typography, Button } from '@material-ui/core';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { openDialog, closeDialog, DialogContent } from '../../../redux/actions/DialogActions';
import { ApplicationState } from '../../../stores/index';

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.toolbar.height,
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        flexButtonContainer: {
            display: 'flex',
        },
        leftButtons: {
            flexGrow: 1,
        },
        disableBottomPadding: {
            paddingBottom: '0px !important',
        },
    });
interface IDomainProps extends WithStyles<typeof styles>, WithSnackbarProps {
    openDialog: (dialogContent: DialogContent) => void;
    closeDialog: () => void;
    closeForm: () => void;
    push: typeof push;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        openDialog: (dialogContent: DialogContent) => {
            const action = openDialog(
                new DialogContent(
                    dialogContent.content,
                    dialogContent.title,
                    dialogContent.confirmText,
                    dialogContent.confirmAction,
                    dialogContent.cancelAction
                )
            );
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
        closeDialog: () => {
            const action = closeDialog();
            dispatch(action);
        },
    };
};

const mapStateToProps = (state: ApplicationState) => {
    return { projectsState: state.projectsState };
};

type DomainState = {
    serverErrors: string[];
};

class Domain extends React.Component<IDomainProps, DomainState> {
    state: DomainState = {
        serverErrors: undefined as string[],
    };

    render() {
        const { classes, closeDialog, enqueueSnackbar } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper elevation={0}>
                        <Typography variant="h5" gutterBottom>
                            'Edit Domain'
                        </Typography>
                    </Paper>
                </main>
            </React.Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(withSnackbar(Domain)));
