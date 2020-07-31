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
import RegularExpressions from '../../../helpers/RegularExpressions';

const tenantService = new TenantService();

interface ChangeOrganizationNameContentProps {
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
            .min(3, 'Min 3 characters')
            .max(28, 'Max 28 characters')
            .matches(
                new RegExp(RegularExpressions.ORGANIZATION_NAME),
                "Must begin, end, and contain alphanumeric characters. May contain the following ( ) (_) (-) (')."
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
                            setSuccess(true);
                            changeOrganizationNameProps.closeDialog();
                        } else {
                            setServerError(response.error.message);
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
                                    Update
                                </FormikSynchronousButton>
                            </DialogActions>
                        </form>
                    </React.Fragment>
                )}
            </Formik>
        </React.Fragment>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeOrganizationNameContent);
