import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Box, Button, Grid } from '@material-ui/core';
import Constants from '../../../theme/Constants';
import ISubscriptionLimitDetails, { ILimitDetails } from '../../../models/app/ISubscriptionLimitDetails';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 345,
        },
        header: {
            height: 140,
            backgroundColor: Constants.COLORS.PRIMARY_COLOR,
        },
        headerFaded: {
            height: 140,
            backgroundColor: theme.palette.primary.light,
        },
        buttons: {
            display: 'flex',
            justifyContent: 'center',
            padding: theme.spacing(2),
        },
        white: {
            color: Constants.COLORS.WHITE,
        },
    })
);

interface PlanCardProps {
    planId: string;
    planName: string;
    cost: string;
    onUpgrade: (planId: string) => void;
    isCurrentPlan: boolean;
    limitDetails: ILimitDetails;
}

export default function PlanCard(props: PlanCardProps) {
    const classes = useStyles(props);

    return (
        <Card className={classes.root} elevation={3}>
            <Box className={props.isCurrentPlan ? classes.headerFaded : classes.header} paddingTop={4}>
                <Typography className={classes.white} align="center" gutterBottom variant="h4">
                    {props.planName}
                </Typography>
                <Typography className={classes.white} align="center" gutterBottom variant="h6">
                    {props.cost}
                </Typography>
            </Box>
            <CardContent>
                <Grid container justify="space-between">
                    <Grid>
                        <Typography variant="body2">Geofences</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body2">{props.limitDetails.geofences}</Typography>
                    </Grid>
                </Grid>
                <Grid container justify="space-between">
                    <Grid>
                        <Typography variant="body2">Integrations</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body2">{props.limitDetails.integrations}</Typography>
                    </Grid>
                </Grid>
                <Grid container justify="space-between">
                    <Grid>
                        <Typography variant="body2">Projects</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body2">{props.limitDetails.projects}</Typography>
                    </Grid>
                </Grid>
                <Grid container justify="space-between">
                    <Grid>
                        <Typography variant="body2">User Accounts</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body2">{props.limitDetails.accounts}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions className={classes.buttons}>
                <Button
                    onClick={() => {
                        props.onUpgrade(props.planId);
                    }}
                    disabled={props.isCurrentPlan}
                    color="primary"
                    variant="contained"
                    data-cb-type="checkout"
                    data-cb-plan-id={props.planId}
                >
                    Upgrade
                </Button>
            </CardActions>
        </Card>
    );
}
