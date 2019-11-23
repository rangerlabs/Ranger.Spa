import * as React from 'react';
import {
    DialogActions,
    Button,
    DialogContentText,
    Typography,
    DialogTitle,
    DialogContent,
    Theme,
    createStyles,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import FormikTextField from '../../form/FormikTextField';
import { Formik, FormikBag, FormikProps } from 'formik';
import * as Yup from 'yup';
import FormikPrimaryButton from '../../form/FormikPrimaryButton';
import IProject from '../../../models/app/IProject';
import ProjectService from '../../../services/ProjectService';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { closeDialog } from '../../../redux/actions/DialogActions';

const projectService = new ProjectService();

const styles = (theme: Theme) =>
    createStyles({
        bold: {
            fontWeight: theme.typography.fontWeightBold,
        },
    });

interface DeleteDomainContentProps extends WithStyles<typeof styles>, WithSnackbarProps {
    name: string;
    push: typeof push;
    closeDialog: () => void;
}

interface DeleteDomainContentState {
    serverError: string;
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

class DeleteDomainContent extends React.Component<DeleteDomainContentProps> {
    state = {
        serverError: undefined as string,
    };
    validationSchema = Yup.object().shape({
        name: Yup.string()
            .matches(new RegExp(`${this.props.name}`), `The name entered is not the domain name.`)
            .required('Required'),
    });

    render() {
        return (
            <React.Fragment>
                <Formik
                    initialValues={{ name: '' }}
                    onSubmit={(values: Partial<IProject>, formikBag: FormikBag<FormikProps<Partial<IProject>>, Partial<IProject>>) => {
                        console.log(values);
                        console.log(`Delete Project ${values.name}`);
                        this.setState({ serverError: undefined });
                        // projectService.deleteProject(deleteProjectContentProps.id).then((response: IRestResponse<void>) => {
                        //     if (response.is_error) {
                        //         deleteProjectContentProps.enqueueSnackbar('An error occurred deleting the domain', { variant: 'error' });
                        //     } else {
                        //         deleteProjectContentProps.closeDialog();
                        //         deleteProjectContentProps.enqueueSnackbar('Domain deleted', { variant: 'success' });
                        //         deleteProjectContentProps.push(RoutePaths.Projects);
                        //     }
                        // });
                    }}
                    validationSchema={this.validationSchema}
                >
                    {props => (
                        <React.Fragment>
                            <DialogTitle>Delete project?</DialogTitle>
                            <form onSubmit={props.handleSubmit}>
                                <DialogContent>
                                    <DialogContentText>
                                        We're sorry to see you go. If there is anything we can help with, please contact us at support@rangerlabs.io.
                                    </DialogContentText>
                                    <DialogContentText color="error">
                                        To delete this domain and all associated data, please confirm the domain name. Once your request is accepted, your data
                                        cannot be recovered.
                                    </DialogContentText>
                                    <DialogContentText className={this.props.classes.bold} color="error">
                                        {this.props.name}
                                    </DialogContentText>
                                    <FormikTextField
                                        name="name"
                                        label="Domain Name"
                                        value={props.values.name}
                                        errorText={props.errors.name}
                                        touched={props.touched.name}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        autoComplete="off"
                                        required
                                    />
                                    {this.state.serverError && <Typography color="error">{this.state.serverError}</Typography>}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.props.closeDialog} color="primary" variant="text">
                                        Cancel
                                    </Button>
                                    <FormikPrimaryButton denseMargin isValid={props.isValid} isSubmitting={props.isSubmitting} variant="text">
                                        Delete domain
                                    </FormikPrimaryButton>
                                </DialogActions>
                            </form>
                        </React.Fragment>
                    )}
                </Formik>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(connect(null, mapDispatchToProps)(withSnackbar(DeleteDomainContent)));
