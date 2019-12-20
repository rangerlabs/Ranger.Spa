import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles, Grid, Typography, Button, Slide } from '@material-ui/core';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

const styles = (theme: Theme) =>
    createStyles({
        typography: {
            [theme.breakpoints.up('md')]: {
                textAlign: 'left',
            },
            textAlign: 'center',
            color: theme.palette.common.black,
        },
        gridHeight: {
            height: '100%',
        },
        menuItemTextColor: {
            color: theme.drawer.text.color,
        },
        signupButton: {
            marginTop: theme.spacing(3),
            minWidth: '175px',
        },
    });

interface OverviewParallaxContentLayerProps extends WithStyles<typeof styles> {
    push: typeof push;
}

class OverviewParallaxContentLayer extends React.Component<OverviewParallaxContentLayerProps> {
    handleSignUpClick = () => {
        this.props.push('/signup');
    };

    render() {
        const { classes } = this.props;
        return (
            <Grid className={classes.gridHeight} container alignContent="center" justify="center">
                <Grid item xs={1} />
                <Grid item md={5} xs={10}>
                    <Slide in direction="right" timeout={1200}>
                        <div>
                            <Typography gutterBottom className={classes.typography} variant="subtitle1">
                                HOSTED APIs FOR
                            </Typography>
                            <Typography className={classes.typography} variant="h3">
                                BOUNDLESS LOCATION SERVICES
                            </Typography>
                            <div className={classes.typography}>
                                <Button color="primary" variant="contained" className={classes.signupButton} onClick={this.handleSignUpClick}>
                                    Sign up for free
                                </Button>
                            </div>
                        </div>
                    </Slide>
                </Grid>
                <Grid item md={6} xs={1} />
            </Grid>
        );
    }
}

export default withStyles(styles)(connect(null, { push })(OverviewParallaxContentLayer));
