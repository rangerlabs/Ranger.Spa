import * as React from 'react';
import withStyles, { WithStyles } from '@material-ui/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import DomainForm from './DomainForm';
import UserForm from './UserForm';
import Review from './Review';
import { createStyles, Fade, Theme } from '@material-ui/core';
import IDomainForm from '../../../models/landing/IDomainForm';
import IUserForm from '../../../models/landing/IUserForm';
import IReviewForm from '../../../models/landing/IReviewForm';

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
            width: 'auto',
            marginTop: theme.toolbar.height,
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.up(500 + theme.spacing(2 * 2))]: {
                width: 500,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
    });

const steps = ['Select your domain', 'Create your user', 'Submit'];

interface SignUpProps extends WithStyles<typeof styles> {}

interface SignUpState {
    prevStep: number;
    activeStep: number;
    domainForm: IDomainForm;
    userForm: IUserForm;
}

class SignUp extends React.Component<SignUpProps, SignUpState> {
    state = {
        activeStep: 0,
        prevStep: undefined as number,
        domainForm: {} as IDomainForm,
        userForm: {} as IUserForm,
    };

    getStepContent(step: number) {
        switch (step) {
            case 0:
                return (
                    <DomainForm
                        domainForm={this.state.domainForm}
                        buttonsClassName={this.props.classes.buttons}
                        handleNext={this.handleNext}
                        setSignUpDomainStateValues={this.setDomainFormValues}
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
                        reviewForm={{ domainForm: this.state.domainForm, userForm: this.state.userForm } as IReviewForm}
                        handleBack={this.handleBack}
                        handleNext={this.handleNext}
                        buttonsClassName={this.props.classes.buttons}
                    />
                );
            default:
                throw new Error('Unknown step');
        }
    }
    setDomainFormValues = (domainFormValues: IDomainForm): void => {
        this.setState({ domainForm: domainFormValues });
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
        const { prevStep, activeStep } = this.state;

        return (
            <Paper className={classes.paper} elevation={3}>
                <Typography component="h1" variant="h4" align="center">
                    Welcome to Ranger
                </Typography>
                <Stepper activeStep={activeStep} className={classes.stepper} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <React.Fragment>
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
                </React.Fragment>
            </Paper>
        );
    }
}

export default withStyles(styles)(SignUp);
