import * as React from 'react';
import IUser from '../../../models/app/IUser';
import UserService from '../../../services/UserService';
import { Formik, FormikProps, FormikBag, FormikErrors } from 'formik';
import FormikSelectValues from '../../form/interfaces/FormikSelectValuesProp';
import * as Yup from 'yup';
import { withStyles, createStyles, Theme, WithStyles, Paper, Grid, CssBaseline, List, ListItemText, Typography, ListItem, TextField } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import FormikTextField from '../../form/FormikTextField';
import FormikSelect from '../../form/FormikSelect';
import FormikCancelButton from '../../form/FormikCancelButton';
import FormikDeleteButton from '../../form/FormikDeleteButton';
import { IRestResponse } from '../../../services/RestUtilities';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { User } from 'oidc-client';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import { addUser, removeUser } from '../../../redux/actions/UserActions';
import { UserProfile } from '../../../models/UserProfile';
import * as queryString from 'query-string';
import populateUsersHOC from '../hocs/PopulateUsersHOC';
import populateProjectsHOC from '../hocs/PopulateProjectsHOC';
import FormikAutocompleteMultiselect from '../../form/FormikAutocompleteMulitselect';
import IProject from '../../../models/app/IProject';
import { RoleEnum, GetRole, GetCascadedRoles } from '../../../models/RoleEnum';
import { StatusEnum } from '../../../models/StatusEnum';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import FormikAutocompleteLabelMultiselect from '../../form/FormikAutocompleteLabelMultiselect';

const userService = new UserService();

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
    });
interface IUserFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    dispatchAddUser: (user: IUser) => void;
    dispatchRemoveUser: (name: string) => void;
    users: IUser[];
    user: User;
    push: typeof push;
    projects: IProject[];
}

type UserFormState = {
    assignableRoles: FormikSelectValues;
    serverErrors: string[];
    initialUser: IUser;
    selectedProjects: IProject[];
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
        dispatchRemoveUser: (email: string) => {
            const action = removeUser(email);
            dispatch(action);
        },
    };
};

class UserForm extends React.Component<IUserFormProps, UserFormState> {
    formikRef: React.RefObject<Formik> = React.createRef();
    state = {
        assignableRoles: [] as FormikSelectValues,
        serverErrors: undefined as string[],
        initialUser: undefined as IUser,
        selectedProjects: undefined as IProject[],
        success: false,
    };

    deleteUser(props: FormikProps<Partial<IUser>>, enqueueSnackbar: any) {
        console.log('DELETE THE USER');
        setTimeout(() => {
            this.props.dispatchRemoveUser(props.values.email);
            enqueueSnackbar('User deleted', { variant: 'error' });
            this.props.push(RoutePaths.Users);
        }, 250);
    }

    UNSAFE_componentWillMount() {
        this.setState((state, props) => ({
            assignableRoles: this.getAssignableRolesFromCurrentUser(props.user),
            initialUser: this.getInitialUserByEmail(props.users),
        }));
    }

    getInitialUserByEmail(users: IUser[]): IUser {
        let result = undefined;
        const params = queryString.parse(window.location.search);
        const email = params['email'] as string;
        if (email && users) {
            result = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (result) {
                if (result.email === (this.props.user.profile as UserProfile).email) {
                    this.props.push(RoutePaths.Users);
                }
            }
        }
        return result;
    }

    getAssignableRolesFromCurrentUser(user: User): FormikSelectValues {
        const roleArray: FormikSelectValues = [];

        var role = GetRole(user.profile.role as string[]);
        var cascadedRoles = GetCascadedRoles(role).reverse();
        cascadedRoles.forEach(value => {
            if (value != RoleEnum.TENANT_OWNER) roleArray.push({ value: value, label: value });
        });
        return roleArray;
    }

    validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(1, 'Must be at least 1 character long')
            .max(48, 'Max 48 characters')
            .matches(
                new RegExp("^[a-zA-Z,.'-]{1}[a-zA-Z ,.'-]{1,26}[a-zA-Z,.'-]{1}$"),
                "Valid characters are A-Z, spaces ( ) commas (,), periods (.), apostraphes ('), and hyphens (-)"
            )
            .required('Required'),
        lastName: Yup.string()
            .min(1, 'Must be at least 1 character long')
            .max(48, 'Max 48 characters')
            .matches(
                new RegExp("^[a-zA-Z,.'-]{1}[a-zA-Z ,.'-]{1,26}[a-zA-Z,.'-]{1}$"),
                "Valid characters are A-Z, spaces ( ) commas (,), periods (.), apostraphes ('), and hyphens (-)"
            )
            .required('Required'),
        email: Yup.string()
            .email('Invalid email')
            .required('Required'),
        role: Yup.mixed().required('Role is required'),
    });

    roles = [
        { value: 'User', label: 'User' },
        { value: 'Admin', label: 'Admin' },
        { value: 'Owner', label: 'Owner' },
    ];

    render() {
        const { classes, users, enqueueSnackbar, dispatchAddUser } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper elevation={0}>
                        <Typography align="center" variant="h5" gutterBottom>
                            {this.state.initialUser ? 'Edit User' : 'Create User'}
                        </Typography>
                        <Formik
                            ref={this.formikRef}
                            enableReinitialize
                            initialValues={
                                this.state.initialUser ? this.state.initialUser : { email: '', firstName: '', lastName: '', role: '', authorizedProjects: [] }
                            }
                            onSubmit={(values: IUser, formikBag: FormikBag<FormikProps<Partial<IUser>>, Partial<IUser>>) => {
                                console.log(values);
                                const newUser = {
                                    email: values.email,
                                    firstName: values.firstName,
                                    lastName: values.lastName,
                                    role: values.role,
                                } as IUser;
                                newUser.authorizedProjects = this.state.selectedProjects ? this.state.selectedProjects.map(p => p.projectId) : undefined;
                                if (this.state.initialUser) {
                                    userService.putUser(newUser.email, newUser).then((response: IRestResponse<IUser>) => {
                                        if (response.is_error) {
                                            const { errors: serverErrors, ...formikErrors } = response.error_content;
                                            enqueueSnackbar('Error updating user.', { variant: 'error' });
                                            formikBag.setErrors(formikErrors as FormikErrors<IUser>);
                                            this.setState({ serverErrors: serverErrors });
                                            formikBag.setSubmitting(false);
                                            formikBag.resetForm(newUser);
                                        } else {
                                            newUser.status = StatusEnum.PENDING;
                                            enqueueSnackbar('Update user request accepted.', { variant: 'info' });
                                            dispatchAddUser(newUser);
                                            formikBag.setSubmitting(false);
                                            this.setState({ success: true });
                                            this.props.push(RoutePaths.Users);
                                        }
                                    });
                                } else {
                                    userService.postUser(newUser).then((response: IRestResponse<IUser>) => {
                                        if (response.is_error) {
                                            const { errors: serverErrors, ...formikErrors } = response.error_content;
                                            enqueueSnackbar('Error creating user.', { variant: 'error' });
                                            formikBag.setErrors(formikErrors as FormikErrors<IUser>);
                                            this.setState({ serverErrors: serverErrors });
                                            formikBag.setSubmitting(false);
                                            formikBag.resetForm(newUser);
                                        } else {
                                            newUser.status = StatusEnum.PENDING;
                                            enqueueSnackbar('Create user request accepted.', { variant: 'info' });
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
                            {props => (
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
                                                disabled={props.initialValues.lastName === '' ? false : true}
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
                                                disabled={props.initialValues.email === '' ? false : true}
                                                required
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
                                                label="Authorized projects"
                                                placeholder=""
                                                enabled={props.values.role.toUpperCase() === RoleEnum.USER.toUpperCase()}
                                                options={this.props.projects}
                                                getOptionLabel={(project: IProject) => project.name}
                                                defaultValue={this.state.initialUser ? this.state.initialUser.authorizedProjects : []}
                                                onChange={(event: React.ChangeEvent<{}>, values: IProject[]) => {
                                                    this.setState({ selectedProjects: values });
                                                    props.handleChange(event);
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
                                                        {this.state.serverErrors.map(error => (
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
                                            >
                                                Delete
                                            </FormikDeleteButton>
                                        </div>
                                        <FormikCancelButton
                                            isSubmitting={props.isSubmitting}
                                            onClick={() => {
                                                this.props.push('/users');
                                            }}
                                        />
                                        {props.initialValues.email === '' ? (
                                            <FormikSynchronousButton
                                                isValid={props.isValid}
                                                isSubmitting={props.isSubmitting}
                                                isSuccess={this.state.success}
                                                variant="contained"
                                            >
                                                Create
                                            </FormikSynchronousButton>
                                        ) : (
                                            <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.success}>
                                                Update
                                            </FormikSynchronousButton>
                                        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateProjectsHOC(populateUsersHOC(withSnackbar(UserForm)))));
