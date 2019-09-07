import * as React from "react";
import { withStyles, createStyles, Theme, WithStyles, CircularProgress } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import Button, { ButtonProps } from "@material-ui/core/Button";
import { green } from "@material-ui/core/colors";
const classNames = require("classnames").default;

const styles = (theme: Theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(3),
            marginLeft: theme.spacing(),
            position: "relative",
        },
        buttonSuccess: {
            backgroundColor: green[500],
            "&:hover": {
                backgroundColor: green[700],
            },
        },
        buttonProgress: {
            color: green[600],
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: -12,
            marginLeft: -12,
        },
    });

interface FormikSynchronousButtonProps extends WithStyles<typeof styles> {
    isValid: boolean;
    isSubmitting: boolean;
    isSuccess: boolean;
}

class FormikSynchronousButton extends React.Component<FormikSynchronousButtonProps & ButtonProps> {
    render() {
        const { isValid, isSubmitting, isSuccess, classes, ...rest } = this.props;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: isSuccess,
        });
        return (
            <div className={classes.root}>
                <Button className={buttonClassname} disabled={!isValid || isSubmitting} type="submit" color="primary" variant="contained" {...rest}>
                    {this.props.children}
                </Button>
                {isSubmitting && !isSuccess && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
        );
    }
}

export default withStyles(styles)(FormikSynchronousButton);
