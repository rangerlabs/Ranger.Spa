import * as React from 'react';
import TenantService from '../../../services/TenantService';
import Grid from '@material-ui/core/Grid';
import { Formik, FormikBag, FormikProps, FormikErrors } from 'formik';
import FormikTextField from '../../form/FormikTextField';
import FormikNextButton from '../../form/FormikNextButton';
import IDomainForm from '../../../models/landing/IDomainForm';
import * as Yup from 'yup';
import { InputAdornment } from '@material-ui/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { StatusEnum } from '../../../models/StatusEnum';
import { DomainState, addDomain } from '../../../redux/actions/DomainActions';
import { connect } from 'react-redux';

const tenantService = new TenantService();
const domainUnavailableErrorText = 'Sorry, this domain is already taken.';
interface DomainFormProps {
    setSignUpDomainStateValues: (domainFormValues: IDomainForm) => void;
    addDomain: (domain: DomainState) => void;
    handleNext: () => void;
    buttonsClassName: string;
    domainForm: IDomainForm;
    isReturn: boolean;
}

interface DomainFormState {
    hasUnavailableDomain: boolean;
    isValidatingDomain: boolean;
}

function mapDispatchToState(dispatch: any) {
    return {
        addDomain(domain: DomainState): void {
            dispatch(addDomain(domain));
        },
    };
}

class DomainForm extends React.Component<DomainFormProps, DomainFormState> {
    formikRef: React.RefObject<Formik> = React.createRef();
    onSearch$: Subject<string>;
    subscription: Subscription;

    state: DomainFormState = {
        hasUnavailableDomain: false,
        isValidatingDomain: false,
    };

    constructor(props: DomainFormProps) {
        super(props);
        this.onSearch$ = new Subject<string>();
    }

    handleDomainChange(domain: string) {
        this.setState({ isValidatingDomain: true, hasUnavailableDomain: false });
        this.onSearch$.next(domain);
    }

    componentDidMount() {
        this.subscription = this.onSearch$.pipe(debounceTime(300)).subscribe(v => {
            tenantService.exists(v).then(v => {
                if (v) {
                    this.setState({ hasUnavailableDomain: true });
                    this.setUnavailableDomainError();
                }
                this.setState({ isValidatingDomain: false });
            });
        });
    }

    private setUnavailableDomainError() {
        this.formikRef.current.setFieldTouched('domain');
        this.formikRef.current.setFieldError('domain', domainUnavailableErrorText);
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
        organizationName: Yup.string()
            .min(3, 'Must be at least 3 characters long')
            .max(28, 'Must be less than 28 characters long')
            .matches(
                new RegExp('^[a-zA-Z0-9]{1}[a-zA-Z0-9- ]{1,26}[a-zA-Z0-9]{1}$'),
                'Must begin, end, and contain alphanumeric characters. Spaces ( ), and hyphens (-) permitted.'
            )
            .required('Required'),
    });

    render() {
        const { buttonsClassName, domainForm } = this.props;
        return (
            <React.Fragment>
                <Formik
                    ref={this.formikRef}
                    initialValues={{
                        domain: domainForm.domain ? domainForm.domain : '',
                        organizationName: domainForm.organizationName ? domainForm.organizationName : '',
                    }}
                    isInitialValid={this.props.isReturn}
                    onSubmit={(values: IDomainForm, formikBag: FormikBag<FormikProps<IDomainForm>, IDomainForm>) => {
                        tenantService.exists(values.domain).then(v => {
                            if (v) {
                                this.setUnavailableDomainError();
                                formikBag.props.setSubmitting(false);
                            } else {
                                this.setState({ hasUnavailableDomain: false });
                                const newDomain = {
                                    domain: values.domain,
                                    organizationName: values.organizationName,
                                } as IDomainForm;
                                const domain = {
                                    domain: values.domain,
                                    correlationId: '',
                                    status: StatusEnum.PENDING,
                                } as DomainState;
                                this.props.addDomain(domain);
                                this.props.setSignUpDomainStateValues(newDomain);
                                this.props.handleNext();
                            }
                        });
                    }}
                    validationSchema={this.validationSchema}
                    validate={values => {
                        if (this.state.hasUnavailableDomain) {
                            const errors = {} as FormikErrors<IDomainForm>;
                            errors.domain = domainUnavailableErrorText;
                            return errors;
                        }
                    }}
                >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormikTextField
                                        name="domain"
                                        label="Domain"
                                        value={props.values.domain}
                                        errorText={props.errors.domain}
                                        touched={props.touched.domain}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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

export default connect(
    null,
    mapDispatchToState
)(DomainForm);
