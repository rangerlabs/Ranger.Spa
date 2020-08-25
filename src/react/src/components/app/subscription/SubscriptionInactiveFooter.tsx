import * as React from 'react';
import { SubscriptionLimitDetailsState } from '../../../redux/actions/SubscriptionLimitDetailsActions';
import { ApplicationState } from '../../../stores';
import { connect } from 'react-redux';
import { Slide, Box, Theme, createStyles, makeStyles, Typography } from '@material-ui/core';
import { useState } from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        inactive: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: theme.toolbar.height,
            backgroundColor: theme.palette.error.main,
            zIndex: theme.zIndex.drawer + 1,
            paddingTop: theme.spacing(2),
        },
        white: {
            color: theme.palette.common.white,
        },
    })
);

interface SubscriptionInactiveFooterProps {
    subscription: SubscriptionLimitDetailsState;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        subscription: state.subscriptionLimitDetailsState,
    };
};

const SubscriptionInactiveFooter = React.memo((props: SubscriptionInactiveFooterProps) => {
    const classes = useStyles(props);
    const isInactive = props.subscription.isLoaded && !props.subscription.subscriptionLimitDetails.active;

    return (
        <Slide in={isInactive} direction="up" mountOnEnter>
            <Box className={classes.inactive}>
                <Typography className={classes.white} align="center" variant="subtitle1">
                    Your subscription is no longer active. Please contact an owner within your organization to reactivate your subscription.
                </Typography>
            </Box>
        </Slide>
    );
});

export default connect(mapStateToProps, null)(SubscriptionInactiveFooter);
