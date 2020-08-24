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
import { IRestResponse, IError, IFormikErrors } from '../../../services/RestUtilities';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { User } from 'oidc-client';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import { addUser, addUserToPendingUpdate, removeUserByName as removeUserByEmail, addUserToPendingDeletion } from '../../../redux/actions/UserActions';
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
import classNames from 'classnames';
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
        title: {
            marginTop: '0px',
            padding: '0px',
        },
        bottomPaper: {
            marginBottom: theme.spacing(3),
        },
    });
interface IUserFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    addUser: (user: IUser) => void;
    addUserToPendingDelete: (user: IUser) => void;
    addUserToPendingUpdate: (user: IUser) => void;
    removeUserByEmail: (email: string) => void;
    user: User;
    push: typeof push;
    projects: IProject[];
    initialUser: IUser;
}

type UserFormState = {
    assignableRoles: FormikSelectValues;
    serverErrors: IFormikErrors;
    selectedProjects: string[];
    isSuccess: boolean;
};

const mapStateToProps = (state: ApplicationState) => {
    return { user: state.oidc.user, users: state.usersState.users, projects: state.projectsState.projects };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        addUser: (user: IUser) => {
            const action = addUser(user);
            dispatch(action);
        },
        addUserToPendingDelete: (user: IUser) => {
            const action = addUserToPendingDeletion(user);
            dispatch(action);
        },
        addUserToPendingUpdate: (user: IUser) => {
            const action = addUserToPendingUpdate(user);
            dispatch(action);
        },
        removeUserByEmail: (email: string) => {
            const action = removeUserByEmail(email);
            dispatch(action);
        },
    };
};

class UserForm extends React.Component<IUserFormProps, UserFormState> {
    state = {
        assignableRoles: [] as FormikSelectValues,
        serverErrors: undefined as IFormikErrors,
        selectedProjects: [] as string[],
        isSuccess: false,
    };

    deleteUser(props: FormikProps<Partial<IUser>>, enqueueSnackbar: any) {
        userService.deleteUser(props.values.email).then((response) => {
            if (response.isError) {
                enqueueSnackbar(response.error.message, { variant: 'error' });
                props.setStatus(response.error.message);
            } else {
                props.values.correlationModel = { correlationId: response.correlationId, status: StatusEnum.PENDING };
                this.props.addUserToPendingDelete(this.props.initialUser);
                this.props.removeUserByEmail(props.values.email);
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
                .filter((p) => projectIds.includes(p.id))
                .map((p) => p.name)
                .sort();
        }
        return [];
    }

    getProjectIdsByProjectNames(projectNames: string[]) {
        if (projectNames) {
            return this.props.projects
                .filter((p) => projectNames.includes(p.name))
                .map((p) => p.id)
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
            .max(48, 'Max 48 characters')
            .matches(new RegExp(RegularExpressions.NAME), "Must begin with and contain alphabetic character. May contain one of ( - ) ( , ) ( ' ) ( . ).")
            .required('Required'),
        lastName: Yup.string()
            .max(48, 'Max 48 characters')
            .matches(new RegExp(RegularExpressions.NAME), "Must begin with and contain alphabetic character. May contain one of ( - ) ( , ) ( ' ) ( . ).")
            .required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        role: Yup.mixed().required('Role is required'),
    });

    render() {
        const { classes, enqueueSnackbar } = this.props;
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
                                const { formikErrors: serverErrors, ...formikErrors } = response.error;
                                enqueueSnackbar(response.error.message, { variant: 'error' });
                                formikBag.setStatus(formikErrors as FormikErrors<IUser>);
                                this.setState({ serverErrors: serverErrors });
                                formikBag.setSubmitting(false);
                                formikBag.resetForm({ values: newUser });
                            } else {
                                this.setState({ isSuccess: true });
                                newUser.correlationModel = { correlationId: response.correlationId, status: StatusEnum.PENDING };
                                this.props.removeUserByEmail(this.props.initialUser.email);
                                this.props.addUserToPendingUpdate(this.props.initialUser);
                                this.props.addUser(newUser);
                                this.props.push(RoutePaths.Users);
                                formikBag.setSubmitting(false);
                            }
                        });
                    } else {
                        userService.postUser(newUser).then((response: IRestResponse<IUser>) => {
                            if (response.isError) {
                                const { formikErrors: serverErrors, ...formikErrors } = response.error;
                                enqueueSnackbar(response.error.message, { variant: 'error' });
                                formikBag.setStatus(formikErrors as FormikErrors<IUser>);
                                this.setState({ serverErrors: serverErrors });
                                formikBag.setSubmitting(false);
                                formikBag.resetForm({ values: newUser });
                            } else {
                                this.setState({ isSuccess: true });
                                newUser.correlationModel = { correlationId: response.correlationId, status: StatusEnum.PENDING };
                                this.props.addUser(newUser);
                                formikBag.setSubmitting(false);
                                this.props.push(RoutePaths.Users);
                            }
                        });
                    }
                }}
                validateOnMount={false}
                isInitialValid={false}
                validationSchema={this.validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <IconButton className={classes.return} disabled={props.isSubmitting} onClick={() => this.props.push(RoutePaths.Integrations)}>
                            <ArrowLeft />
                        </IconButton>
                        <Typography className={classNames(classes.title, classes.paper)} align="left" variant="h5">
                            {this.props.initialUser ? 'Edit User' : 'New User'}
                        </Typography>
                        <Paper className={classes.paper} elevation={3}>
                            <Typography variant="h6" gutterBottom>
                                User Details
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
                                        <FormikSynchronousButton
                                            isValid={props.isValid}
                                            isSubmitting={props.isSubmitting}
                                            isSuccess={this.state.isSuccess}
                                            variant="contained"
                                        >
                                            {props.initialValues.email === '' ? 'Create' : 'Update'}
                                        </FormikSynchronousButton>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                        {this.props.initialUser && (
                            <Paper className={classNames(classes.bottomPaper, classes.paper)} elevation={3}>
                                <Typography variant="h6">Delete</Typography>
                                <Typography variant="subtitle1">Remove the user from your organization.</Typography>
                                <Grid container justify="flex-end">
                                    <Grid item>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateProjectsHOC(populateUserAuthorizedProjectsHOC(withSnackbar(UserForm)))));
