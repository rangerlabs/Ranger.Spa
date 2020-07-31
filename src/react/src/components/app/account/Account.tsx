import * as React from 'react';
import IUser from '../../../models/app/IUser';
import UserService from '../../../services/UserService';
import { Formik, FormikProps, FormikBag, FormikErrors } from 'formik';
import { UserProfile } from '../../../models/UserProfile';
import * as Yup from 'yup';
import { withStyles, createStyles, Theme, WithStyles, Paper, Grid, List, ListItemText, ListItem, Button, Typography, IconButton } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import FormikTextField from '../../form/FormikTextField';
import FormikUpdateButton from '../../form/FormikUpdateButton';
import FormikDeleteButton from '../../form/FormikDeleteButton';
import { IRestResponse, IError, IFormikErrors } from '../../../services/RestUtilities';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { User } from 'oidc-client';
import { push } from 'connected-react-router';
import DeleteAccountComponent from '../dialogContents/DeleteAccountContent';
import { openDialog, DialogContent } from '../../../redux/actions/DialogActions';
import ChangePasswordContent from '../dialogContents/ChangePasswordContent';
import ChangeEmailContent from '../dialogContents/ChangeEmailContent';
import { getRole, userIsInRole } from '../../../helpers/Helpers';
import IAccountUpdateModel from '../../../models/app/IAccountUpdateModel';
import UserManager from '../../../services/UserManager';
import { RoleEnum } from '../../../models/RoleEnum';
import TransferOwnershipContent from '../dialogContents/TransferOwnershipContent';
import populatePendingPrimaryOwnerTransferHOC from '../hocs/PopulatePendingPrimaryOwnerTransferHOC';
import { PendingPrimaryOwnerTransfer } from '../../../models/app/PendingPrimaryOwnerTransfer';
import CancelOwnershipTransferContent from '../dialogContents/CancelOwnershipTransferContent';
import ArrowLeft from 'mdi-material-ui/ArrowLeft';
import Constants from '../../../theme/Constants';
import RoutePaths from '../../RoutePaths';
import { red } from '@material-ui/core/colors';
import classNames from 'classnames';
import populateUsersHOC from '../hocs/PopulateUsersHOC';
import RegularExpressions from '../../../helpers/RegularExpressions';

const userService = new UserService();
const styles = (theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(4),
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.spacing(3),
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        return: {
            position: 'sticky',
            top: theme.toolbar.height + theme.spacing(4),
            marginLeft: theme.spacing(4),
        },
        toolbar: {
            height: Constants.HEIGHT.TOOLBAR,
        },
        changePassword: {
            marginTop: theme.spacing(3),
        },
        title: {
            marginTop: '0px',
            padding: '0px',
        },
        bottomPaper: {
            marginBottom: theme.spacing(3),
        },
        transfer: {
            marginTop: theme.spacing(3),
            color: red[600],
            '&:hover': {
                backgroundColor: '#e539351c',
                color: theme.palette.error.main,
            },
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: red[600],
        },
    });

interface AccountProps extends WithStyles<typeof styles>, WithSnackbarProps {
    user: User;
    pendingPrimaryOwnerTransfer: PendingPrimaryOwnerTransfer;
    openDialog: (dialogContent: DialogContent) => void;
    dispatchAddUser: (user: IUser) => void;
    expireUser: () => void;
    closeForm: () => void;
    push: typeof push;
    history: History;
    canTransferOwnership: boolean;
}

interface AccountState {
    serverErrors: IFormikErrors;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        user: state.oidc.user,
        pendingPrimaryOwnerTransfer: state.organizationState.pendingPrimaryOwnerTransfer,
        canTransferOwnership: state.usersState.users.length > 1,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        openDialog: (dialogContent: DialogContent) => {
            const action = openDialog(dialogContent);
            dispatch(action);
        },
    };
};

class Account extends React.Component<AccountProps, AccountState> {
    state = {
        serverErrors: undefined as IFormikErrors,
    };

    validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .max(48, 'Max 48 characters')
            .matches(new RegExp(RegularExpressions.NAME), "Must begin with and contain alphabetic character. May contain one of the following (-) (,) (') (.).")
            .required('Required'),
        lastName: Yup.string()
            .max(48, 'Max 48 characters')
            .matches(new RegExp(RegularExpressions.NAME), "Must begin with and contain alphabetic character. May contain one of the following (-) (,) (') (.).")
            .required('Required'),
    });

    isPrimaryOwner = Boolean(userIsInRole(this.props.user, RoleEnum.PRIMARY_OWNER));

    render() {
        const { classes, enqueueSnackbar } = this.props;
        return (
            <Formik
                enableReinitialize
                initialValues={{
                    email: (this.props.user.profile as UserProfile).email,
                    firstName: (this.props.user.profile as UserProfile).firstName,
                    lastName: (this.props.user.profile as UserProfile).lastName,
                    role: getRole((this.props.user.profile as UserProfile).role),
                    authorizedProjects: (this.props.user.profile as UserProfile).authorizedProjects,
                }}
                validateOnMount={false}
                isInitialValid={false}
                onSubmit={(values: IUser, formikBag: FormikBag<FormikProps<Partial<IUser>>, Partial<IUser>>) => {
                    this.setState({ serverErrors: undefined });
                    const accountUpdate = {
                        firstName: values.firstName,
                        lastName: values.lastName,
                    } as IAccountUpdateModel;
                    userService.updateAccount(accountUpdate).then((response: IRestResponse<void>) => {
                        if (response.isError) {
                            const { formikErrors: serverErrors, ...formikErrors } = response.error;
                            enqueueSnackbar(response.error.message, { variant: 'error' });
                            formikBag.setStatus(formikErrors as FormikErrors<IUser>);
                            this.setState({ serverErrors: serverErrors });
                            formikBag.setSubmitting(false);
                        } else {
                            UserManager.signinSilent();
                            enqueueSnackbar(response.message, { variant: 'success' });
                            formikBag.setSubmitting(false);
                        }
                    });
                }}
                validationSchema={this.validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <IconButton
                            className={classes.return}
                            disabled={props.isSubmitting}
                            onClick={() => (window.history.length ? window.history.back() : this.props.push(RoutePaths.Dashboard))}
                        >
                            <ArrowLeft />
                        </IconButton>
                        <Typography className={classNames(classes.title, classes.paper)} variant="h5">
                            Your Account
                        </Typography>
                        <Paper className={classes.paper} elevation={3}>
                            <Typography variant="h6" gutterBottom>
                                Account Details
                            </Typography>
                            <form onSubmit={props.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormikTextField
                                            name="firstName"
                                            label="Firstname"
                                            value={props.values.firstName}
                                            errorText={props.errors.firstName}
                                            touched={props.touched.firstName}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            autoComplete="off"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormikTextField
                                            name="lastName"
                                            label="Lastname"
                                            value={props.values.lastName}
                                            errorText={props.errors.lastName}
                                            touched={props.touched.lastName}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            autoComplete="off"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormikTextField
                                            name="email"
                                            label="Email"
                                            value={props.values.email}
                                            errorText={props.errors.email}
                                            touched={props.touched.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            autoComplete="off"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormikTextField
                                            name="role"
                                            label="Role"
                                            value={props.values.role}
                                            errorText={props.errors.role}
                                            touched={props.touched.role}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            disabled
                                        />
                                    </Grid>
                                    {/* {this.state.serverErrors && (
                                        <Grid item xs={12}>
                                            <List>
                                                <ListItem>
                                                    {this.state.serverErrors.map((error) => (
                                                        <ListItemText primary={error} />
                                                    ))}
                                                </ListItem>
                                            </List>
                                        </Grid>
                                    )} */}
                                </Grid>
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <FormikUpdateButton color="primary" isValid={props.isValid} isSubmitting={props.isSubmitting} variant="outlined" />
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                        <Paper className={classNames(classes.paper)} elevation={3}>
                            <Typography variant="h6">Change Password</Typography>
                            <Typography variant="subtitle1">Request a password reset email.</Typography>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Button
                                        onClick={() => {
                                            this.props.openDialog(new DialogContent(<ChangePasswordContent />));
                                        }}
                                        color="primary"
                                        className={classes.changePassword}
                                        disabled={props.isSubmitting}
                                        variant="outlined"
                                    >
                                        Change
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper
                            className={
                                !this.props.canTransferOwnership && !this.isPrimaryOwner ? classNames(classes.bottomPaper, classes.paper) : classes.paper
                            }
                            elevation={3}
                        >
                            <Typography variant="h6">Change Email</Typography>
                            <Typography variant="subtitle1">Change your account email address.</Typography>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Button
                                        onClick={() => {
                                            this.props.openDialog(new DialogContent(<ChangeEmailContent />));
                                        }}
                                        color="primary"
                                        className={classes.changePassword}
                                        disabled={props.isSubmitting}
                                        variant="outlined"
                                    >
                                        Change
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                        {this.props.canTransferOwnership && this.isPrimaryOwner && (
                            <Paper className={classNames(classes.bottomPaper, classes.paper)} elevation={3}>
                                <Typography variant="h6">Transfer Domain Ownership</Typography>
                                <Typography variant="subtitle1">Transfer primary ownership of the domain to another user.</Typography>
                                {this.props.pendingPrimaryOwnerTransfer && (
                                    <Typography variant="subtitle1" color="error">
                                        A transfer has been initiated.
                                    </Typography>
                                )}
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        {this.props.pendingPrimaryOwnerTransfer ? (
                                            <Button
                                                onClick={() => {
                                                    this.props.openDialog(new DialogContent(<CancelOwnershipTransferContent />));
                                                }}
                                                color="primary"
                                                className={classes.transfer}
                                                variant="outlined"
                                            >
                                                Cancel Transfer
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => {
                                                    this.props.openDialog(new DialogContent(<TransferOwnershipContent />));
                                                }}
                                                color="primary"
                                                className={classes.transfer}
                                                variant="outlined"
                                            >
                                                Transfer
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}
                        {!this.isPrimaryOwner && (
                            <Paper className={classNames(classes.bottomPaper, classes.paper)} elevation={3}>
                                <Typography variant="h6">Delete Account</Typography>
                                <Typography variant="subtitle1">Remove your account from your organization.</Typography>
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <FormikDeleteButton
                                            isSubmitting={props.isSubmitting}
                                            dialogTitle="Delete Account?"
                                            disabled={this.isPrimaryOwner}
                                            dialogContent={<DeleteAccountComponent />}
                                        >
                                            Delete
                                        </FormikDeleteButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}
                    </React.Fragment>
                )}
            </Formik>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(populateUsersHOC(populatePendingPrimaryOwnerTransferHOC(withStyles(styles)(withSnackbar(Account)))));
