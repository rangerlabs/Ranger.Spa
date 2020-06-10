import * as React from 'react';
import { withStyles, createStyles, WithStyles, Paper, CssBaseline, Theme, Typography, Grid, IconButton, InputAdornment } from '@material-ui/core';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { closeDialog } from '../../../redux/actions/DialogActions';
import { ApplicationState } from '../../../stores/index';
import { Formik, FormikProps } from 'formik';
import FormikDeleteButton from '../../form/FormikDeleteButton';
import FormikValidationErrors from '../../form/FormikServerErrors';
import DeleteOrganizationContent from '../dialogContents/DeleteOrganizationContent';
import { IValidationError } from '../../../services/RestUtilities';
import ArrowLeft from 'mdi-material-ui/ArrowLeft';
import Constants from '../../../theme/Constants';
import classNames from 'classnames';
import FormikTextField from '../../form/FormikTextField';
import populateOrganizationNameHOC from '../hocs/PopulateOrganizationNameHOC';
import { OrganizationState } from '../../../redux/actions/OrganizationActions';
import RoutePaths from '../../RoutePaths';
import IOrganizationForm from '../../../models/IOrganizationForm';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import TenantService from '../../../services/TenantService';

const domainUnavailableErrorText = 'Sorry, this domain is unavailable.';

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
interface IOrganizationFormProps extends WithStyles<typeof styles> {
    closeDialog: () => void;
    closeForm: () => void;
    push: typeof push;
    organization: OrganizationState;
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

const mapStateToProps = (state: ApplicationState) => {
    return { organization: state.organizationState };
};

type OrganizationFormState = {
    hasUnavailableDomain: boolean;
    isValidatingDomain: boolean;
    serverErrors: IValidationError[];
};

class OrganizationForm extends React.Component<IOrganizationFormProps, OrganizationFormState> {
    tenantService = new TenantService();
    onSearch$: Subject<string>;
    subscription: Subscription;

    state: OrganizationFormState = {
        hasUnavailableDomain: false,
        isValidatingDomain: false,
        serverErrors: undefined as IValidationError[],
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
        const { classes } = this.props;
        return (
            <Formik
                enableReinitialize
                initialValues={{ domain: this.props.organization.domain, organizationName: this.props.organization.organizationName }}
                onSubmit={(values: IOrganizationForm) => {}}
                validationSchema={this.validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <IconButton className={classes.return} disabled={props.isSubmitting} onClick={() => this.props.push(RoutePaths.Integrations)}>
                            <ArrowLeft />
                        </IconButton>
                        <Typography className={classNames(classes.title, classes.paper)} align="left" variant="h5">
                            Edit Organization
                        </Typography>
                        <Paper className={classes.paper} elevation={3}>
                            <Typography variant="h6" gutterBottom>
                                Organization Details
                            </Typography>

                            <form onSubmit={props.handleSubmit}>
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
                                <Grid container spacing={3}>
                                    {this.state.serverErrors && (
                                        <Grid item xs={12}>
                                            <FormikValidationErrors errors={this.state.serverErrors} />
                                        </Grid>
                                    )}
                                </Grid>
                            </form>
                        </Paper>
                        <Paper className={classNames(classes.bottomPaper, classes.paper)} elevation={3}>
                            <Typography variant="h6">Delete</Typography>
                            <Typography variant="subtitle1">Delete your organization</Typography>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <FormikDeleteButton
                                        isSubmitting={props.isSubmitting}
                                        dialogTitle={`Delete ${this.props.organization.domain}?`}
                                        dialogContent={<DeleteOrganizationContent />}
                                    >
                                        Delete
                                    </FormikDeleteButton>
                                </Grid>
                            </Grid>
                        </Paper>
                    </React.Fragment>
                )}
            </Formik>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateOrganizationNameHOC(OrganizationForm)));
