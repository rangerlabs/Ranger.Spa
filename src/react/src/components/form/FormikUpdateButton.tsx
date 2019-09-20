import * as React from "react";
import { Button, withStyles, createStyles, Theme, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";

const styles = (theme: Theme) =>
    createStyles({
        root: { marginTop: theme.spacing(3), marginLeft: theme.spacing(1) },
    });

interface FormikUpdateButtonProps extends WithStyles<typeof styles> {
    isValid: boolean;
    isSubmitting: boolean;
}

class FormikUpdateButton extends React.Component<FormikUpdateButtonProps & ButtonProps> {
    render() {
        const { isValid, isSubmitting, classes, ...rest } = this.props;
        return (
            <Button className={classes.root} disabled={!isValid || isSubmitting} type="submit" color="primary" variant="contained" {...rest}>
                Update
            </Button>
        );
    }
}

export default withStyles(styles)(FormikUpdateButton);
