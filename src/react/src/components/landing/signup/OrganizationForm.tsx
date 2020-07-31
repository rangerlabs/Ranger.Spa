import * as React from 'react';
import TenantService from '../../../services/TenantService';
import Grid from '@material-ui/core/Grid';
import { Formik, FormikBag, FormikProps, FormikErrors } from 'formik';
import FormikTextField from '../../form/FormikTextField';
import FormikNextButton from '../../form/FormikNextButton';
import IOrganizationForm from '../../../models/IOrganizationForm';
import * as Yup from 'yup';
import { InputAdornment } from '@material-ui/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { StatusEnum } from '../../../models/StatusEnum';
import { OrganizationState, setDomain } from '../../../redux/actions/OrganizationActions';
import { connect } from 'react-redux';
import RegularExpressions from '../../../helpers/RegularExpressions';

const domainUnavailableErrorText = 'Sorry, this domain is unavailable.';

interface IOrganizationFormProps {
    setSignUpOrganizationStateValues: (organizationFormValues: IOrganizationForm) => void;
    addDomain: (domain: string) => void;
    handleNext: () => void;
    buttonsClassName: string;
    orgnizationForm: IOrganizationForm;
    isReturn: boolean;
}

interface OrganizationFormState {
    hasUnavailableDomain: boolean;
    isValidatingDomain: boolean;
}

function mapDispatchToState(dispatch: any) {
    return {
        addDomain(domain: string): void {
            dispatch(setDomain(domain));
        },
    };
}

class OrganizationForm extends React.Component<IOrganizationFormProps, OrganizationFormState> {
    tenantService = new TenantService();
    onSearch$: Subject<string>;
    subscription: Subscription;

    state: OrganizationFormState = {
        hasUnavailableDomain: false,
        isValidatingDomain: false,
    };

    constructor(props: IOrganizationFormProps) {
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
                    } else {
                        this.setState({ hasUnavailableDomain: false });
                        props.setFieldError('domain', undefined);
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
            .min(3, 'Min 3 characters')
            .max(28, 'Max 28 characters')
            .matches(new RegExp(RegularExpressions.ORGANIZATION_DOMAIN), 'Must begin, end, and contain alphanumeric characters. May contain hyphens (-).')
            .required('Required'),
        organizationName: Yup.string()
            .min(3, 'Min 3 characters')
            .max(28, 'Max 28 characters')
            .matches(
                new RegExp(RegularExpressions.ORGANIZATION_NAME),
                "Must begin, end, and contain alphanumeric characters. May contain the following ( ) (_) (-) (')."
            )
            .required('Required'),
    });

    render() {
        const { buttonsClassName, orgnizationForm: organizationForm } = this.props;
        return (
            <React.Fragment>
                <Formik
                    initialValues={{
                        domain: organizationForm.domain ? organizationForm.domain : '',
                        organizationName: organizationForm.organizationName ? organizationForm.organizationName : '',
                    }}
                    isInitialValid={this.props.isReturn}
                    onSubmit={(values: IOrganizationForm) => {
                        this.setState({ hasUnavailableDomain: false });
                        const newDomain = {
                            domain: values.domain,
                            organizationName: values.organizationName,
                        } as IOrganizationForm;
                        const domain = {
                            domain: values.domain,
                            correlationId: '',
                            status: StatusEnum.PENDING,
                        } as OrganizationState;
                        this.props.addDomain(domain.domain);
                        this.props.setSignUpOrganizationStateValues(newDomain);
                        this.props.handleNext();
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
                        <form onSubmit={props.handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormikTextField
                                        infoText="Your organization's personalized domain."
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
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormikTextField
                                        infoText="The name of your organization."
                                        name="organizationName"
                                        label="Organization name"
                                        value={props.values.organizationName}
                                        errorText={props.errors.organizationName}
                                        touched={props.touched.organizationName}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        autoComplete="off"
                                    />
                                </Grid>
                            </Grid>
                            <div className={buttonsClassName}>
                                <FormikNextButton isValid={props.isValid && !this.state.isValidatingDomain} type="submit" />
                            </div>
                        </form>
                    )}
                </Formik>
            </React.Fragment>
        );
    }
}

export default connect(null, mapDispatchToState)(OrganizationForm);
