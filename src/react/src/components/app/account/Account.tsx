import * as React from 'react';
import IUser from '../../../models/app/IUser';
import UserService from '../../../services/UserService';
import { Formik, FormikProps, FormikBag, FormikErrors } from 'formik';
import { UserProfile } from '../../../models/UserProfile';
import * as Yup from 'yup';
import { withStyles, createStyles, Theme, WithStyles, Paper, Grid, List, ListItemText, ListItem, Button, Typography, IconButton } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import FormikTextField from '../../form/FormikTextField';
import FormikPrimaryButton from '../../form/FormikPrimaryButton';
import FormikUpdateButton from '../../form/FormikUpdateButton';
import FormikDeleteButton from '../../form/FormikDeleteButton';
import { IRestResponse, IValidationError } from '../../../services/RestUtilities';
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

const userService = new UserService();
const styles = (theme: Theme) =>
    createStyles({
        return: {
            margin: theme.spacing(4),
        },
        toolbar: {
            height: Constants.HEIGHT.TOOLBAR,
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        flexButtonContainer: {
            display: 'flex',
        },
        leftButtons: {
            flexGrow: 1,
        },
        changePassword: {
            marginTop: theme.spacing(3),
        },
        paper: {
            padding: theme.spacing(4),
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.down(600 + theme.spacing(2 * 2))]: {
                marginTop: theme.toolbar.height,
            },
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
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
    serverErrors: IValidationError[];
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        user: state.oidc.user,
        pendingPrimaryOwnerTransfer: state.domain.pendingPrimaryOwnerTransfer,
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
        serverErrors: undefined as IValidationError[],
    };

    validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(1, 'Must be at least 1 character long')
            .max(48, 'Max 48 characters')
            .matches(new RegExp("^([\\-\\s,.'a-zA-Z]){1,}$"), "Valid characters are A-Z, spaces ( ) commas (,), periods (.), apostraphes ('), and hyphens (-)")
            .required('Required'),
        lastName: Yup.string()
            .min(1, 'Must be at least 1 character long')
            .max(48, 'Max 48 characters')
            .matches(new RegExp("^([\\-\\s,.'a-zA-Z]){1,}$"), "Valid characters are A-Z, spaces ( ) commas (,), periods (.), apostraphes ('), and hyphens (-)")
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
                onSubmit={(values: IUser, formikBag: FormikBag<FormikProps<Partial<IUser>>, Partial<IUser>>) => {
                    this.setState({ serverErrors: undefined });
                    const accountUpdate = {
                        firstName: values.firstName,
                        lastName: values.lastName,
                    } as IAccountUpdateModel;
                    userService.updateAccount((this.props.user.profile as UserProfile).email, accountUpdate).then((response: IRestResponse<void>) => {
                        if (response.isError) {
                            const { validationErrors: serverErrors, ...formikErrors } = response.error;
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
                        <IconButton className={classes.return} disabled={props.isSubmitting} onClick={window.history.back}>
                            <ArrowLeft />
                        </IconButton>
                        <Paper className={classes.paper} elevation={3}>
                            <Typography align="center" variant="h5" gutterBottom>
                                Your Account
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
                                            InputProps={{
                                                endAdornment: (
                                                    <Button
                                                        disabled={props.isSubmitting}
                                                        onClick={() => {
                                                            this.props.openDialog(new DialogContent(<ChangeEmailContent />));
                                                        }}
                                                    >
                                                        Change
                                                    </Button>
                                                ),
                                            }}
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
                                    {this.state.serverErrors && (
                                        <Grid item xs={12}>
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
                                <div className={classes.flexButtonContainer}>
                                    <div className={classes.leftButtons}>
                                        <FormikDeleteButton
                                            isSubmitting={props.isSubmitting}
                                            dialogTitle="Delete account?"
                                            disabled={this.isPrimaryOwner}
                                            dialogContent={<DeleteAccountComponent />}
                                        >
                                            Delete
                                        </FormikDeleteButton>
                                        <Button
                                            onClick={() => {
                                                this.props.openDialog(new DialogContent(<ChangePasswordContent />));
                                            }}
                                            className={classes.changePassword}
                                            disabled={props.isSubmitting}
                                            variant="text"
                                        >
                                            Change password
                                        </Button>
                                    </div>
                                    {props.initialValues.email === '' ? (
                                        <FormikPrimaryButton isValid={props.isValid} isSubmitting={props.isSubmitting} variant="contained" />
                                    ) : (
                                        <FormikUpdateButton isValid={props.isValid} isSubmitting={props.isSubmitting} />
                                    )}
                                </div>
                            </form>

                            {this.props.canTransferOwnership && this.isPrimaryOwner && (
                                <Paper className={classes.paper} elevation={3}>
                                    <Typography variant="h5">Transfer Domain Ownerhship</Typography>
                                    <Typography variant="subtitle1">Transfer primary ownership of a domain to an existing user.</Typography>
                                    {this.props.pendingPrimaryOwnerTransfer ? (
                                        <Button
                                            onClick={() => {
                                                this.props.openDialog(new DialogContent(<CancelOwnershipTransferContent />));
                                            }}
                                        >
                                            Cancel Transfer
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                this.props.openDialog(new DialogContent(<TransferOwnershipContent />));
                                            }}
                                        >
                                            Transfer
                                        </Button>
                                    )}
                                </Paper>
                            )}
                        </Paper>
                    </React.Fragment>
                )}
            </Formik>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(populatePendingPrimaryOwnerTransferHOC(withStyles(styles)(withSnackbar(Account))));
