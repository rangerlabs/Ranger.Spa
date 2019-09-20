import * as React from "react";
import { Button, withStyles, createStyles, Theme, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";

const styles = (theme: Theme) =>
    createStyles({
        root: { marginTop: theme.spacing(3), marginLeft: theme.spacing(1) },
    });

interface FormikBackButtonProps extends WithStyles<typeof styles> {}

class FormikBackButton extends React.Component<FormikBackButtonProps & ButtonProps> {
    render() {
        const { classes, ...rest } = this.props;
        return (
            <Button className={classes.root} {...rest}>
                Back
            </Button>
        );
    }
}

export default withStyles(styles)(FormikBackButton);
