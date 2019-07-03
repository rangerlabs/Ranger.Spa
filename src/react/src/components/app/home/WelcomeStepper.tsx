import * as React from "react";
import { Theme, createStyles, WithStyles } from "@material-ui/core";
import { connect } from "react-redux";

const styles = (theme: Theme) =>
    createStyles({
        root: {},
    });

interface WelcomeStepperProps extends WithStyles<typeof styles> {}

interface WelcomeStepperState {
    activeStep: number;
}

class WelcomeStepper extends React.Component<WelcomeStepperProps, WelcomeStepperState> {
    state = {
        activeStep: 0,
    };

    render() {
        return <React.Fragment />;
    }
}

export default connect(
    null,
    null
)(WelcomeStepper);
