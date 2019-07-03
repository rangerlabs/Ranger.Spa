import * as React from "react";
import { Theme, createStyles, WithStyles, withStyles, Grid, Typography, Button, Slide } from "@material-ui/core";
import classNames from "classnames";
import { push } from "connected-react-router";
import { connect } from "react-redux";

const styles = (theme: Theme) =>
    createStyles({
        typography: {
            [theme.breakpoints.up("md")]: {
                textAlign: "left",
            },
            textAlign: "center",
        },
        gridHeight: {
            height: "100%",
        },
        menuItemTextColor: {
            color: theme.drawer.text.color,
        },
        signupButton: {
            marginTop: "60px",
            minWidth: "175px",
            background: "linear-gradient(135deg,  #ac6cc6 50%, #8f70c2 100%)",
            color: "white",
        },
        readTheDocsButton: {
            background: "white",
            marginTop: "60px",
            minWidth: "150px",
        },
    });

interface OverviewLayerProps extends WithStyles<typeof styles> {
    push: typeof push;
}

class OverviewParallaxContentLayer extends React.Component<OverviewLayerProps> {
    handleSignUpClick = () => {
        this.props.push("/signup");
    };

    render() {
        const { classes } = this.props;
        return (
            <Grid className={classes.gridHeight} container alignContent="center" justify="center">
                <Grid item xs={1} />
                <Grid item md={5} xs={10}>
                    <Slide in direction="right" timeout={1500}>
                        <div>
                            <Typography gutterBottom className={classNames(classes.typography, classes.menuItemTextColor)} variant="h6">
                                HOSTED GEO-FENCE APIs FOR
                            </Typography>
                            <Typography className={classNames(classes.typography, classes.menuItemTextColor)} variant="h2">
                                BOUNDLESS LOCATION SERVICES
                            </Typography>
                            <Button variant="contained" className={classes.signupButton} onClick={this.handleSignUpClick}>
                                <Typography className={classes.menuItemTextColor} variant="subtitle1">
                                    Sign up for free
                                </Typography>
                            </Button>
                        </div>
                    </Slide>
                </Grid>
                <Grid item md={6} xs={1} />
            </Grid>
        );
    }
}

export default withStyles(styles)(
    connect(
        null,
        { push }
    )(OverviewParallaxContentLayer)
);
