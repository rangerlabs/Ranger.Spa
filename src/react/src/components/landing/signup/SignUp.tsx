import * as React from 'react';
import withStyles, { WithStyles } from '@material-ui/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import OrganizationForm from './OrganizationForm';
import UserForm from './UserForm';
import Review from './Review';
import { createStyles, Theme } from '@material-ui/core';
import IOrganizationForm from '../../../models/IOrganizationForm';
import IUserForm from '../../../models/landing/IUserForm';
import IReviewForm from '../../../models/landing/IReviewForm';
import Footer from '../footer/Footer';

const styles = (theme: Theme) =>
    createStyles({
        stepper: {
            padding: `${theme.spacing(3)}px 0 ${theme.spacing(5)}px`,
            backgroundColor: theme.palette.common.white,
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        paper: {
            padding: theme.spacing(4),
        },
        layout: {
            paddingTop: '3%',
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.up(500 + theme.spacing(2 * 2))]: {
                width: 500,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        title: {
            margin: theme.spacing(5),
        },
    });

const steps = ['Create your organization', 'Create your user', 'Submit'];

interface SignUpProps extends WithStyles<typeof styles> {}

interface SignUpState {
    prevStep: number;
    activeStep: number;
    organizationForm: IOrganizationForm;
    userForm: IUserForm;
}

class SignUp extends React.Component<SignUpProps, SignUpState> {
    state = {
        activeStep: 0,
        prevStep: undefined as number,
        organizationForm: {} as IOrganizationForm,
        userForm: {} as IUserForm,
    };

    getStepContent(step: number) {
        switch (step) {
            case 0:
                return (
                    <OrganizationForm
                        orgnizationForm={this.state.organizationForm}
                        buttonsClassName={this.props.classes.buttons}
                        handleNext={this.handleNext}
                        setSignUpOrganizationStateValues={this.setOrganizationFormValues}
                        isReturn={this.isBackStep()}
                    />
                );
            case 1:
                return (
                    <UserForm
                        userForm={this.state.userForm}
                        buttonsClassName={this.props.classes.buttons}
                        handleNext={this.handleNext}
                        handleBack={this.handleBack}
                        setSignUpUserStateValues={this.setUserFormValues}
                    />
                );
            case 2:
                return (
                    <Review
                        reviewForm={{ organizationForm: this.state.organizationForm, userForm: this.state.userForm } as IReviewForm}
                        handleBack={this.handleBack}
                        handleNext={this.handleNext}
                        buttonsClassName={this.props.classes.buttons}
                    />
                );
            default:
                throw new Error('Unknown step');
        }
    }
    setOrganizationFormValues = (organizationFormValues: IOrganizationForm): void => {
        this.setState({ organizationForm: organizationFormValues });
    };

    setUserFormValues = (userFormValues: IUserForm): void => {
        this.setState({ userForm: userFormValues });
    };

    isBackStep = () => {
        if (this.state.prevStep && this.state.activeStep < this.state.prevStep) {
            return true;
        }
        return false;
    };

    handleNext = () => {
        this.setState((state) => ({
            prevStep: state.activeStep,
            activeStep: state.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState((state) => ({
            prevStep: state.activeStep,
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    render() {
        const { classes } = this.props;
        const { activeStep } = this.state;

        return (
            <React.Fragment>
                <div className={classes.layout}>
                    <Typography className={classes.title} component="h1" variant="h4" align="center">
                        Welcome to Ranger
                    </Typography>
                    <Paper elevation={3} className={classes.paper}>
                        <Stepper activeStep={activeStep} className={classes.stepper} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom align="center">
                                    Thank you for registering.
                                </Typography>
                                <Typography variant="subtitle1" align="center">
                                    We're creating your domain and account.
                                </Typography>
                                <Typography variant="subtitle1" align="center">
                                    You will receive an email shortly to confirm your domain.
                                </Typography>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>{this.getStepContent(activeStep)}</React.Fragment>
                        )}
                    </Paper>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(SignUp);
