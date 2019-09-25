import * as React from "react";
import DashboardAppSelect from "./DashboardAppSelect";
import { Typography, createStyles, Theme, withStyles, WithStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { ApplicationState } from "../../../stores";
import IApp from "../../../models/app/IApp";

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            margin: theme.spacing(2),
        },
    });

interface DashboardProps extends WithStyles<typeof styles> {
    apps: IApp[];
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        apps: state.apps,
    };
};

class Dashboard extends React.Component<DashboardProps> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.layout}>
                {this.props.apps.length === 0 ? null : (
                    <React.Fragment>
                        <DashboardAppSelect />
                    </React.Fragment>
                )}
                <Typography align="left" variant="subtitle1">
                    Usage
                </Typography>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    null
)(withStyles(styles)(Dashboard));
