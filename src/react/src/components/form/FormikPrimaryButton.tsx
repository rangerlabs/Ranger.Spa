import * as React from "react";
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core";
import Button, { ButtonProps } from "@material-ui/core/Button";

const styles = (theme: Theme) =>
    createStyles({
        root: { marginTop: theme.spacing.unit * 3, marginLeft: theme.spacing.unit },
    });

interface FormikPrimaryButtonProps extends WithStyles<typeof styles> {
    isValid: boolean;
    isSubmitting: boolean;
    variant: "outlined" | "contained" | "text";
}

class FormikPrimaryButton extends React.Component<FormikPrimaryButtonProps & ButtonProps> {
    render() {
        const { isValid, isSubmitting, classes, variant, ...rest } = this.props;
        return (
            <Button className={classes.root} disabled={!isValid || isSubmitting} type="submit" color="primary" variant={variant} {...rest}>
                {this.props.children ? this.props.children : "Create"}
            </Button>
        );
    }
}

export default withStyles(styles)(FormikPrimaryButton);
