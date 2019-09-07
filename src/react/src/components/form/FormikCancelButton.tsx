import * as React from "react";
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core";
import Button, { ButtonProps } from "@material-ui/core/Button";

const styles = (theme: Theme) =>
    createStyles({
        root: { marginTop: theme.spacing(3), marginLeft: theme.spacing() },
    });

interface FormikCancelButtonProps extends WithStyles<typeof styles> {
    isSubmitting: boolean;
    onClick: () => void;
}

class FormikCancelButton extends React.Component<FormikCancelButtonProps & ButtonProps> {
    render() {
        const { isSubmitting, classes, onClick, ...rest } = this.props;
        return (
            <Button className={classes.root} onClick={onClick} {...rest}>
                {isSubmitting ? "Close" : "Cancel"}
            </Button>
        );
    }
}

export default withStyles(styles)(FormikCancelButton);
