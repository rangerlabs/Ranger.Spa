import * as React from "react";
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core";
import Button, { ButtonProps } from "@material-ui/core/Button";

const styles = (theme: Theme) =>
    createStyles({
        root: { marginTop: theme.spacing(3), marginLeft: theme.spacing() },
    });

interface FormikNextButtonProps extends WithStyles<typeof styles> {
    isValid: boolean;
}

class FormikNextButton extends React.Component<FormikNextButtonProps & ButtonProps> {
    render() {
        const { isValid, classes, ...rest } = this.props;
        return (
            <Button className={classes.root} disabled={!isValid} type="submit" color="primary" variant="contained" {...rest}>
                Next
            </Button>
        );
    }
}

export default withStyles(styles)(FormikNextButton);
