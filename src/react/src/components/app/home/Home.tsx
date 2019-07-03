import * as React from "react";
import HomeAppSelect from "./HomeAppSelect";
import { Typography, createStyles, Theme, withStyles, WithStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { ApplicationState } from "../../../stores";
import IApp from "../../../models/app/IApp";

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            margin: theme.spacing.unit * 2,
        },
    });

interface HomeProps extends WithStyles<typeof styles> {
    apps: IApp[];
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        apps: state.apps,
    };
};

class Home extends React.Component<HomeProps> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.layout}>
                {this.props.apps.length === 0 ? null : (
                    <React.Fragment>
                        <HomeAppSelect />
                    </React.Fragment>
                )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    null
)(withStyles(styles)(Home));
