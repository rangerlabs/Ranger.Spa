import * as React from 'react';
import { withStyles, createStyles, WithStyles, Paper, CssBaseline, Theme, Typography, Button, Grid } from '@material-ui/core';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { openDialog, closeDialog, DialogContent } from '../../../redux/actions/DialogActions';
import { ApplicationState } from '../../../stores/index';
import { Formik } from 'formik';
import FormikCancelButton from '../../form/FormikCancelButton';
import FormikDeleteButton from '../../form/FormikDeleteButton';
import FormikServerErrors from '../../form/FormikServerErrors';
import DeleteDomainContent from '../dialogContents/DeleteDomainContent';

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
interface IDomainProps extends WithStyles<typeof styles> {
    closeDialog: () => void;
    closeForm: () => void;
    push: typeof push;
    domain: string;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        closeDialog: () => {
            const action = closeDialog();
            dispatch(action);
        },
    };
};

const mapStateToProps = (state: ApplicationState) => {
    return { domainState: state.domain.domain };
};

type DomainState = {
    serverErrors: string[];
};

class Domain extends React.Component<IDomainProps, DomainState> {
    state: DomainState = {
        serverErrors: undefined as string[],
    };

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper elevation={0}>
                        <Typography align="center" variant="h5" gutterBottom>
                            Edit Domain
                        </Typography>
                        <Formik enableReinitialize initialValues={{}} onSubmit={() => {}} validationSchema={{}}>
                            {props => (
                                <form onSubmit={props.handleSubmit}>
                                    <Grid container spacing={3}>
                                        {this.state.serverErrors && (
                                            <Grid item xs={12}>
                                                <FormikServerErrors errors={this.state.serverErrors} />
                                            </Grid>
                                        )}
                                    </Grid>
                                    <div className={classes.flexButtonContainer}>
                                        <div className={classes.leftButtons}>
                                            <FormikDeleteButton
                                                isSubmitting={props.isSubmitting}
                                                dialogTitle={`Delete ${this.props.domain}?`}
                                                dialogContent={<DeleteDomainContent name={this.props.domain} />}
                                            >
                                                Delete Domain
                                            </FormikDeleteButton>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </Paper>
                </main>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Domain));
