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
    Link,
} from '@material-ui/core';
import FormikTextField from '../../form/FormikTextField';
import { Formik, FormikBag, FormikProps } from 'formik';
import * as Yup from 'yup';
import IProject from '../../../models/app/IProject';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { closeDialog } from '../../../redux/actions/DialogActions';
import TenantService from '../../../services/TenantService';
import RoutePaths from '../../RoutePaths';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import { ApplicationState } from '../../../stores';

const tenantService = new TenantService();

const styles = (theme: Theme) =>
    createStyles({
        bold: {
            fontWeight: theme.typography.fontWeightBold,
        },
    });

interface DeleteOrganizationContentProps extends WithStyles<typeof styles>, WithSnackbarProps {
    name: string;
    push: typeof push;
    closeDialog: () => void;
}

interface DeleteOrganizationContentState {
    isSuccess: boolean;
    serverError: string;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        name: state.organizationState.domain,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        closeDialog: () => {
            const action = closeDialog();
            dispatch(action);
        },
    };
};

class DeleteOrganizationContent extends React.Component<DeleteOrganizationContentProps, DeleteOrganizationContentState> {
    state = {
        isSuccess: false,
        serverError: undefined as string,
    };
    validationSchema = Yup.object().shape({
        name: Yup.string()
            .matches(new RegExp(`^${this.props.name}$`), `The name entered is not the domain name.`)
            .required('Required'),
    });

    render() {
        return (
            <React.Fragment>
                <Formik
                    initialValues={{ name: '' }}
                    onSubmit={(values: Partial<IProject>, formikBag: FormikBag<FormikProps<Partial<IProject>>, Partial<IProject>>) => {
                        tenantService.deleteOrganization(values.name).then((v) => {
                            if (!v.isError) {
                                this.setState({ isSuccess: true });
                                this.props.closeDialog();
                                this.props.push(RoutePaths.Logout);
                            } else {
                                this.setState({ serverError: v.error.message });
                            }
                            formikBag.setSubmitting(false);
                        });
                    }}
                    is
                    validationSchema={this.validationSchema}
                >
                    {(props) => (
                        <React.Fragment>
                            <DialogTitle>Delete project?</DialogTitle>
                            <form onSubmit={props.handleSubmit}>
                                <DialogContent>
                                    <DialogContentText>
                                        We're sorry to see you go. If there is anything we can help with, please contact us at{' '}
                                        <Link href="mailto:support@rangerlabs.io">support@rangerlabs.io</Link>.
                                    </DialogContentText>
                                    <DialogContentText>To delete your organization, please enter your domain name as shown below.</DialogContentText>
                                    <DialogContentText className={this.props.classes.bold} color="error">
                                        {this.props.name}
                                    </DialogContentText>
                                    <FormikTextField
                                        name="name"
                                        label="Organization Name"
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
                                    <FormikSynchronousButton
                                        denseMargin
                                        isValid={props.isValid}
                                        isSuccess={this.state.isSuccess}
                                        isSubmitting={props.isSubmitting}
                                        variant="text"
                                    >
                                        Delete organization
                                    </FormikSynchronousButton>
                                </DialogActions>
                            </form>
                        </React.Fragment>
                    )}
                </Formik>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(withSnackbar(DeleteOrganizationContent)));
