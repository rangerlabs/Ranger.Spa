import * as React from 'react';
import { DialogActions, Button, DialogContentText, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { useState } from 'react';
import FormikTextField from '../../form/FormikTextField';
import { Formik, FormikBag, FormikProps } from 'formik';
import * as Yup from 'yup';
import { closeDialog } from '../../../redux/actions/DialogActions';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import { IRestResponse } from '../../../services/RestUtilities';
import IOrganizationForm from '../../../models/IOrganizationForm';
import TenantService from '../../../services/TenantService';
import { OrganizationState } from '../../../redux/actions/OrganizationActions';

const tenantService = new TenantService();

interface ChangeOrganizationNameContentProps extends WithSnackbarProps {
    closeDialog: () => void;
    organization: OrganizationState;
}

const mapStateToProps = (state: ApplicationState) => {
    return { organization: state.organizationState };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        closeDialog: () => {
            const action = closeDialog();
            dispatch(action);
        },
    };
};

function ChangeOrganizationNameContent(changeOrganizationNameProps: ChangeOrganizationNameContentProps): JSX.Element {
    const [serverError, setServerError] = useState(undefined as string);
    const [success, setSuccess] = useState(false);

    const validationSchema = Yup.object().shape({
        organizationName: Yup.string()
            .min(3, 'Must be at least 3 characters long')
            .max(28, 'Must be less than 28 characters long')
            .matches(
                new RegExp('^[a-zA-Z0-9]{1}[a-zA-Z0-9- ]{1,26}[a-zA-Z0-9]{1}$'),
                'Must begin, end, and contain alphanumeric characters. Spaces ( ), and hyphens (-) permitted.'
            )
            .required('Required'),
    });

    return (
        <React.Fragment>
            <Formik
                initialValues={{ organizationName: changeOrganizationNameProps.organization.organizationName } as IOrganizationForm}
                onSubmit={(values: IOrganizationForm, formikBag: FormikBag<FormikProps<IOrganizationForm>, IOrganizationForm>) => {
                    values.version = changeOrganizationNameProps.organization.version + 1;
                    setServerError(undefined);
                    tenantService.putTenantOrganization(changeOrganizationNameProps.organization.domain, values).then((response: IRestResponse<void>) => {
                        if (!response.isError) {
                            changeOrganizationNameProps.enqueueSnackbar(response.message, { variant: 'success' });
                            setSuccess(true);
                            changeOrganizationNameProps.closeDialog();
                        } else {
                            setServerError(response.error.message);
                            changeOrganizationNameProps.enqueueSnackbar(response.message, { variant: 'error' });
                            formikBag.setSubmitting(false);
                        }
                    });
                }}
                validationSchema={validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <DialogTitle>Change organization name</DialogTitle>
                        <form onSubmit={props.handleSubmit}>
                            <DialogContent>
                                <DialogContentText>Please enter the organization's new name.</DialogContentText>
                                <FormikTextField
                                    name="organizationName"
                                    label="Organization Name"
                                    value={props.values.organizationName}
                                    errorText={props.errors.organizationName}
                                    touched={props.touched.organizationName}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    autoComplete="off"
                                    required
                                />
                                {serverError && <Typography color="error">{serverError}</Typography>}
                            </DialogContent>
                            <DialogActions>
                                <Button disabled={props.isSubmitting} onClick={changeOrganizationNameProps.closeDialog} color="primary" variant="text">
                                    Cancel
                                </Button>
                                <FormikSynchronousButton
                                    denseMargin
                                    isSuccess={success}
                                    isValid={props.isValid}
                                    isSubmitting={props.isSubmitting}
                                    variant="text"
                                >
                                    Request Email Change
                                </FormikSynchronousButton>
                            </DialogActions>
                        </form>
                    </React.Fragment>
                )}
            </Formik>
        </React.Fragment>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(ChangeOrganizationNameContent));
