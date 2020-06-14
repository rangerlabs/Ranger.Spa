import * as React from 'react';
import { DialogActions, Button, DialogContentText, DialogContent, DialogTitle, Typography, InputAdornment } from '@material-ui/core';
import { useState } from 'react';
import FormikTextField from '../../form/FormikTextField';
import { Formik, FormikBag, FormikProps, FormikErrors } from 'formik';
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
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const domainUnavailableErrorText = 'Sorry, this domain is unavailable.';
const tenantService = new TenantService();

interface ChangeOrganizationDomainContentProps {
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

interface OrganizationFormState {
    hasUnavailableDomain: boolean;
    isValidatingDomain: boolean;
    success: boolean;
    serverError: string;
}

class ChangeOrganizationDomainContent extends React.Component<ChangeOrganizationDomainContentProps, OrganizationFormState> {
    tenantService = new TenantService();
    onSearch$: Subject<string>;
    subscription: Subscription;

    state: OrganizationFormState = {
        hasUnavailableDomain: false,
        isValidatingDomain: false,
        success: false,
        serverError: undefined,
    };

    constructor(props: ChangeOrganizationDomainContentProps) {
        super(props);
        this.onSearch$ = new Subject<string>();
    }

    handleDomainChange(domain: string) {
        this.setState({ isValidatingDomain: true, hasUnavailableDomain: false });
        this.onSearch$.next(domain);
    }

    private componentDidMountToDomainResponse(props: FormikProps<IOrganizationForm>) {
        this.subscription = this.onSearch$.pipe(debounceTime(300)).subscribe((v) => {
            if (v && v.length >= 3) {
                this.tenantService.exists(v).then((response) => {
                    if (response.result) {
                        this.setState({ hasUnavailableDomain: true });
                        this.setUnavailableDomainError(props);
                    }
                    this.setState({ isValidatingDomain: false });
                });
            }
        });
    }

    private setUnavailableDomainError(props: FormikProps<IOrganizationForm>) {
        props.setFieldTouched('domain');
        props.setFieldError('domain', domainUnavailableErrorText);
    }

    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    validationSchema = Yup.object().shape({
        domain: Yup.string()
            .min(3, 'Must be at least 3 characters long')
            .max(28, 'Must be less than 28 characters long')
            .matches(
                new RegExp('^[a-zA-Z0-9]{1}[a-zA-Z0-9-]{1,26}[a-zA-Z0-9]{1}$'),
                'Must begin, end, and contain alphanumeric characters. Hyphens (-) permitted.'
            )
            .required('Required'),
    });

    render() {
        return (
            <React.Fragment>
                <Formik
                    initialValues={
                        {
                            domain: this.props.organization.domain,
                        } as IOrganizationForm
                    }
                    onSubmit={(values: IOrganizationForm, formikBag: FormikBag<FormikProps<IOrganizationForm>, IOrganizationForm>) => {
                        values.version = this.props.organization.version + 1;
                        this.setState({ serverError: undefined });
                        tenantService.putTenantOrganization(this.props.organization.domain, values).then((response: IRestResponse<void>) => {
                            if (!response.isError) {
                                this.setState({ success: true });
                                this.props.closeDialog();
                            } else {
                                this.setState({ serverError: response.error.message });
                                formikBag.setSubmitting(false);
                            }
                        });
                    }}
                    validationSchema={this.validationSchema}
                    validate={(values) => {
                        if (this.state.hasUnavailableDomain) {
                            const errors = {} as FormikErrors<IOrganizationForm>;
                            errors.domain = domainUnavailableErrorText;
                            return errors;
                        }
                    }}
                >
                    {(props) => (
                        <React.Fragment>
                            <DialogTitle>Change Organization Domain</DialogTitle>
                            <form onSubmit={props.handleSubmit}>
                                <DialogContent>
                                    <DialogContentText>
                                        Please enter the organization's new domain. Successfully updating the domain will require all active users to sign back
                                        in.
                                    </DialogContentText>
                                    <FormikTextField
                                        name="domain"
                                        label="Domain"
                                        value={props.values.domain}
                                        errorText={props.errors.domain}
                                        touched={props.touched.domain}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (!this.subscription) {
                                                this.componentDidMountToDomainResponse(props);
                                            }
                                            this.handleDomainChange(e.target.value);
                                            props.handleChange(e);
                                        }}
                                        onBlur={props.handleBlur}
                                        InputProps={{ endAdornment: <InputAdornment position="end">.rangerlabs.io</InputAdornment> }}
                                        autoComplete="off"
                                        required
                                    />
                                    {this.state.serverError && <Typography color="error">{this.state.serverError}</Typography>}
                                </DialogContent>
                                <DialogActions>
                                    <Button disabled={props.isSubmitting} onClick={this.props.closeDialog} color="primary" variant="text">
                                        Cancel
                                    </Button>
                                    <FormikSynchronousButton
                                        denseMargin
                                        isSuccess={this.state.success}
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
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeOrganizationDomainContent);
