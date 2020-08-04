import * as React from 'react';
import { Formik, FormikProps, FormikBag } from 'formik';
import { DialogContent, openDialog } from '../../../../../redux/actions/DialogActions';
import { Theme, createStyles, WithStyles, List, ListItem, ListItemText, withStyles, Grid, Typography } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { connect } from 'react-redux';
import FormikSynchronousButton from '../../../../form/FormikSynchronousButton';
import { push } from 'connected-react-router';
import IProject from '../../../../../models/app/IProject';
import FormikCancelButton from '../../../../form/FormikCancelButton';
import TestRun from '../../../../../models/app/geofences/TestRun';
import { TestRunState } from '../../../../../redux/actions/GoogleMapsActions';
import TestRunService from '../../../../../services/TestRunService';

const styles = (theme: Theme) =>
    createStyles({
        form: {
            paddingTop: 0,
            paddingRight: theme.spacing(2),
            paddingBottom: 0,
            paddingLeft: theme.spacing(2),
        },
        leftButtons: {
            flexGrow: 1,
        },
        title: {
            marginBottom: theme.spacing(2),
        },
        width100TemporaryChromiumFix: {
            width: '100%',
        },
        toolbar: {
            height: theme.toolbar.height * 1.5,
        },
        bottomPush: {
            height: theme.toolbar.height,
        },
        controls: {
            display: 'flex',
            position: 'sticky',
            bottom: '0px',
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            background: theme.palette.common.white,
            boxShadow: '0px -3px 3px -2px rgba(0,0,0,0.2), 0px -3px 4px 0px rgba(0,0,0,0.14)',
        },
        listItems: {
            display: 'block',
            textAlign: 'center',
        },
    });

interface TesRunFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    theme: Theme;
    testRun: TestRunState;
    selectedProject: IProject;
    closeDrawer: () => void;
    openDialog: (dialogCotent: DialogContent) => void;
    clearNewTestRun: () => void;
    push: (path: string) => void;
}

interface TestRunFormState {
    serverErrors: string[];
    isSuccess: boolean;
    cancelClicked: boolean;
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
        push: (path: string) => {
            dispatch(push(path));
        },
    };
};

class TestRunDrawerContent extends React.Component<TesRunFormProps, TestRunFormState> {
    constructor(props: TesRunFormProps) {
        super(props);
    }

    testRunService = new TestRunService();

    state: TestRunFormState = {
        serverErrors: undefined,
        isSuccess: false,
        cancelClicked: false,
    };

    cancelSaveGeofence = (formikBag: FormikBag<FormikProps<TestRun>, TestRun>) => {
        formikBag.setSubmitting(false);
    };

    postTestRun = (testRun: TestRun, formikBag: FormikBag<FormikProps<TestRun>, TestRun>) => {
        this.testRunService.postTestRun(this.props.selectedProject.projectId, testRun).then((v) => {
            if (!v.isError) {
                this.setState({ isSuccess: true });
                this.props.enqueueSnackbar('Executing test run...', { variant: 'success' });
                this.props.push('/' + this.props.selectedProject.name + '/geofences/map');
                this.props.closeDrawer();
                this.props.clearNewTestRun();
            } else {
                this.setState({ serverErrors: [v.error.message] });
                this.props.enqueueSnackbar('Failed to execute test run', { variant: 'error' });
            }
            formikBag.setSubmitting(false);
            this.setState({ isSuccess: false });
        });
    };

    cancelGeofence = () => {
        this.setState({ cancelClicked: true });
        this.props.clearNewTestRun();
        this.setState({ serverErrors: undefined });
        this.props.push('/' + this.props.selectedProject.name + '/geofences/map');
        this.props.closeDrawer();
    };

    render() {
        const { classes } = this.props;
        return (
            <Formik
                enableReinitialize={false}
                initialValues={{ positions: this.props.testRun.coordinatePairArray } as TestRun}
                validateOnMount={false}
                isInitialValid={false}
                onSubmit={(values: TestRun, formikBag: FormikBag<FormikProps<TestRun>, TestRun>) => {
                    this.postTestRun(values, formikBag);
                }}
            >
                {(props) => (
                    <React.Fragment>
                        <form onSubmit={props.handleSubmit}>
                            <div className={classes.form}>
                                <div className={classes.toolbar} />
                                <Typography className={classes.title} variant="h5" align="left">
                                    {'Execute Test Run'}
                                </Typography>
                                <Typography className={classes.title} variant="subtitle1" align="left">
                                    Use Test Runs to verify your integrations work as expected with real geofences.
                                </Typography>
                                <Typography className={classes.title} variant="body1" align="left">
                                    Breadcrumb will be simulated at the following {props.values.positions.length} positions. The Test Run will execute
                                    integrations in the TEST environment with a simulated random accuracy in the range [0, 30] and with all location times
                                    simulated at 5 minute intervals.
                                </Typography>
                                <Grid container direction="column" spacing={4}>
                                    <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                        <List>
                                            {props.values.positions.map((c, i) => {
                                                return (
                                                    <ListItem className={classes.listItems} divider key={`breadcrumb_${i}`}>
                                                        <Typography variant="body1">Lng: {c.lng}</Typography>
                                                        <Typography variant="body1">Lat: {c.lat}</Typography>
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                    </Grid>
                                    {this.state.serverErrors && (
                                        <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                            <List>
                                                <ListItem>
                                                    {this.state.serverErrors.map((error) => (
                                                        <ListItemText primary={error} />
                                                    ))}
                                                </ListItem>
                                            </List>
                                        </Grid>
                                    )}
                                </Grid>
                                <div className={classes.bottomPush} />
                            </div>
                            <div className={classes.controls}>
                                <div className={classes.leftButtons}></div>
                                <FormikCancelButton isSubmitting={props.isSubmitting} onClick={this.cancelGeofence} />
                                <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.isSuccess}>
                                    Execute
                                </FormikSynchronousButton>
                            </div>
                        </form>
                    </React.Fragment>
                )}
            </Formik>
        );
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(withSnackbar(TestRunDrawerContent)));
