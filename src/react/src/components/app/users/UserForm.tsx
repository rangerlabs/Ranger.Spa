import * as React from 'react';
import IUser from '../../../models/app/IUser';
import UserService from '../../../services/UserService';
import { Formik, FormikProps, FormikBag, FormikErrors } from 'formik';
import FormikSelectValues from '../../form/interfaces/FormikSelectValuesProp';
import * as Yup from 'yup';
import { withStyles, createStyles, Theme, WithStyles, Paper, Grid, List, ListItemText, Typography, ListItem, IconButton } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import FormikTextField from '../../form/FormikTextField';
import FormikSelect from '../../form/FormikSelect';
import FormikDeleteButton from '../../form/FormikDeleteButton';
import { IRestResponse, IValidationError } from '../../../services/RestUtilities';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { User } from 'oidc-client';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import { addUser, removeUser, updateUser } from '../../../redux/actions/UserActions';
import populateUserAuthorizedProjectsHOC from '../hocs/PopulateUserAuthorizedProjectsHOC';
import populateProjectsHOC from '../hocs/PopulateProjectsHOC';
import IProject from '../../../models/app/IProject';
import { RoleEnum } from '../../../models/RoleEnum';
import { StatusEnum } from '../../../models/StatusEnum';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import FormikAutocompleteLabelMultiselect from '../../form/FormikAutocompleteLabelMultiselect';
import { getRole, getCascadedRoles } from '../../../helpers/Helpers';
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
        paper: {
            padding: theme.spacing(4),
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
    });
interface IUserFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    dispatchAddUser: (user: IUser) => void;
    dispatchUpdateUser: (user: IUser) => void;
    dispatchRemoveUser: (name: string) => void;
    user: User;
    push: typeof push;
    projects: IProject[];
    initialUser: IUser;
}

type UserFormState = {
    assignableRoles: FormikSelectValues;
    serverErrors: IValidationError[];
    selectedProjects: string[];
    success: boolean;
};

const mapStateToProps = (state: ApplicationState) => {
    return { user: state.oidc.user, users: state.usersState.users, projects: state.projectsState.projects };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        dispatchAddUser: (user: IUser) => {
            const action = addUser(user);
            dispatch(action);
        },
        dispatchUpdateUser: (user: IUser) => {
            const action = updateUser(user);
            dispatch(action);
        },
        dispatchRemoveUser: (email: string) => {
            const action = removeUser(email);
            dispatch(action);
        },
    };
};

class UserForm extends React.Component<IUserFormProps, UserFormState> {
    state = {
        assignableRoles: [] as FormikSelectValues,
        serverErrors: undefined as IValidationError[],
        selectedProjects: [] as string[],
        success: false,
    };

    deleteUser(props: FormikProps<Partial<IUser>>, enqueueSnackbar: any) {
        userService.deleteUser(props.values.email).then((response) => {
            if (response.isError) {
                enqueueSnackbar(response.error.message, { variant: 'error' });
                props.setStatus(response.error.message);
            } else {
                enqueueSnackbar(response.message, { variant: 'success' });
                this.props.dispatchRemoveUser(props.values.email);
                this.props.push(RoutePaths.Users);
            }
        });
    }

    UNSAFE_componentWillMount() {
        this.setState((state, props) => ({
            assignableRoles: this.getAssignableRolesFromCurrentUser(props.user),
        }));
    }

    getProjectNamesByProjectIds(projectIds: string[]) {
        if (projectIds) {
            return this.props.projects
                .filter((p) => projectIds.includes(p.projectId))
                .map((p) => p.name)
                .sort();
        }
        return [];
    }

    getProjectIdsByProjectNames(projectNames: string[]) {
        if (projectNames) {
            return this.props.projects
                .filter((p) => projectNames.includes(p.name))
                .map((p) => p.projectId)
                .sort();
        }
        return [];
    }
    getAssignableRolesFromCurrentUser(user: User): FormikSelectValues {
        const roleArray: FormikSelectValues = [];

        var role = getRole(user.profile.role as string[]);
        var cascadedRoles = getCascadedRoles(role).reverse();
        cascadedRoles.forEach((value) => {
            if (value != RoleEnum.PRIMARY_OWNER) roleArray.push({ value: value, label: value });
        });
        return roleArray;
    }

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
        email: Yup.string().email('Invalid email').required('Required'),
        role: Yup.mixed().required('Role is required'),
    });

    render() {
        const { classes, enqueueSnackbar, dispatchAddUser, dispatchUpdateUser } = this.props;
        return (
            <Formik
                enableReinitialize
                initialValues={
                    this.props.initialUser
                        ? {
                              ...this.props.initialUser,
                              authorizedProjects: this.getProjectNamesByProjectIds(this.props.initialUser.authorizedProjects),
                          }
                        : { email: '', firstName: '', lastName: '', role: 'User', authorizedProjects: [] }
                }
                onSubmit={(values: IUser, formikBag: FormikBag<FormikProps<Partial<IUser>>, Partial<IUser>>) => {
                    const newUser = {
                        email: values.email,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        role: values.role,
                        authorizedProjects: this.getProjectIdsByProjectNames(values.authorizedProjects),
                    } as IUser;
                    if (this.props.initialUser) {
                        userService.putUser(newUser.email, newUser).then((response: IRestResponse<IUser>) => {
                            if (response.isError) {
                                const { validationErrors: serverErrors, ...formikErrors } = response.error;
                                enqueueSnackbar(response.error.message, { variant: 'error' });
                                formikBag.setStatus(formikErrors as FormikErrors<IUser>);
                                this.setState({ serverErrors: serverErrors });
                                formikBag.setSubmitting(false);
                                formikBag.resetForm({ values: newUser });
                            } else {
                                newUser.correlationModel = { correlationId: response.correlationId, status: StatusEnum.PENDING };
                                dispatchUpdateUser(newUser);
                                formikBag.setSubmitting(false);
                                this.setState({ success: true });
                                this.props.push(RoutePaths.Users);
                            }
                        });
                    } else {
                        userService.postUser(newUser).then((response: IRestResponse<IUser>) => {
                            if (response.isError) {
                                const { validationErrors: serverErrors, ...formikErrors } = response.error;
                                enqueueSnackbar(response.error.message, { variant: 'error' });
                                formikBag.setStatus(formikErrors as FormikErrors<IUser>);
                                this.setState({ serverErrors: serverErrors });
                                formikBag.setSubmitting(false);
                                formikBag.resetForm({ values: newUser });
                            } else {
                                newUser.correlationModel = { correlationId: response.correlationId, status: StatusEnum.PENDING };
                                dispatchAddUser(newUser);
                                formikBag.setSubmitting(false);
                                this.setState({ success: true });
                                this.props.push(RoutePaths.Users);
                            }
                        });
                    }
                }}
                validationSchema={this.validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <div className={classes.toolbar}>
                            <IconButton
                                size="small"
                                className={classes.return}
                                disabled={props.isSubmitting}
                                onClick={() => this.props.push(RoutePaths.Integrations)}
                            >
                                <ArrowLeft />
                            </IconButton>
                        </div>
                        <Paper className={classes.paper} elevation={3}>
                            <Typography align="center" variant="h5" gutterBottom>
                                {this.props.initialUser ? 'Edit User' : 'New User'}
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
                                            disabled={props.initialValues.firstName === '' ? false : true}
                                            required={!Boolean(this.props.initialUser)}
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
                                            disabled={props.initialValues.lastName === '' ? false : true}
                                            required={!Boolean(this.props.initialUser)}
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
                                            disabled={props.initialValues.email === '' ? false : true}
                                            required={!Boolean(this.props.initialUser)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormikSelect
                                            name="role"
                                            label="Role"
                                            value={props.values.role}
                                            selectValues={this.state.assignableRoles}
                                            errorText={props.errors.role}
                                            touched={props.touched.role}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormikAutocompleteLabelMultiselect
                                            name="authorizedProjects"
                                            label="Authorized Projects"
                                            placeholder=""
                                            enabled={props.values.role.toUpperCase() === RoleEnum.USER.toUpperCase()}
                                            options={this.props.projects.map((p) => p.name)}
                                            defaultValue={
                                                this.props.initialUser ? this.getProjectNamesByProjectIds(this.props.initialUser.authorizedProjects) : []
                                            }
                                            onChange={(event: React.ChangeEvent<{}>, values: string[]) => {
                                                props.setFieldValue('authorizedProjects', values, true);
                                            }}
                                        />
                                        {props.values.role.toUpperCase() !== RoleEnum.USER.toUpperCase() && (
                                            <Typography variant="subtitle1">Admins and Owners have access to all projects.</Typography>
                                        )}
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
                                            onConfirm={() => {
                                                this.deleteUser(props, enqueueSnackbar);
                                            }}
                                            dialogTitle="Delete user?"
                                            confirmText="Delete"
                                            dialogContent={'Are you sure you want to delete user ' + props.values.email + '?'}
                                            disabled={!Boolean(this.props.initialUser)}
                                        >
                                            Delete
                                        </FormikDeleteButton>
                                    </div>
                                    <FormikSynchronousButton
                                        isValid={props.isValid}
                                        isSubmitting={props.isSubmitting}
                                        isSuccess={this.state.success}
                                        variant="contained"
                                    >
                                        {props.initialValues.email === '' ? 'Create' : 'Update'}
                                    </FormikSynchronousButton>
                                </div>
                            </form>
                        </Paper>
                    </React.Fragment>
                )}
            </Formik>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateProjectsHOC(populateUserAuthorizedProjectsHOC(withSnackbar(UserForm)))));
