import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        signUp: {
            background: theme.palette.primary.main,
            marginTop: `${theme.spacing(5)}px !important`,
        },
        trialButton: {
            minWidth: '25%',
            margin: theme.spacing(4),
            color: theme.palette.common.white,
            '&:hover': {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.primary.main,
            },
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.palette.common.white,
        },
        child: {
            backgroundColor: theme.palette.primary.main,
        },
    })
);

interface PricingProps {
    push: typeof push;
}

const GetStartedForFree = function (props: PricingProps) {
    const classes = useStyles(props);

    return (
        <React.Fragment>
            <Grid className={classes.signUp} container item justify="center" xs={12}>
                <Button
                    TouchRippleProps={{ classes: { child: classes.child } }}
                    className={classes.trialButton}
                    onClick={() => props.push(RoutePaths.SignUp)}
                    variant="outlined"
                >
                    START FOR FREE TODAY
                </Button>
            </Grid>
        </React.Fragment>
    );
};

export default connect(null, { push })(GetStartedForFree);
