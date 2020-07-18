import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Box, Button, Grid } from '@material-ui/core';
import Constants from '../../../theme/Constants';
import { ILimitDetails } from '../../../models/app/ILimitDetails';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 345,
            padding: theme.spacing(2),
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        header: {
            textAlign: 'center',
        },
        pricing: {
            maxHeight: theme.spacing(4),
            minHeight: theme.spacing(4),
            paddingTop: theme.spacing(1),
        },
        headerFaded: {
            textAlign: 'center',
        },
        buttons: {
            display: 'flex',
            justifyContent: 'center',
            padding: theme.spacing(2),
        },
        white: {
            color: Constants.COLORS.WHITE,
        },
        cardContent: {
            paddingTop: 0,
        },
        message: {
            maxHeight: '66px',
            minHeight: '66px',
        },
    })
);

interface PlanCardProps {
    planName: string;
    cost: string;
    message: string;
    limitDetails: ILimitDetails;
}

export default function PlanCard(props: PlanCardProps) {
    const classes = useStyles(props);

    function numberWithCommas(x: number): string {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return (
        <Card className={classes.root} elevation={3}>
            <Box className={classes.header}>
                <Typography color="primary" align="center" variant="h6">
                    {props.planName}
                </Typography>
                <Box paddingTop={1} paddingBottom={1} display="inline-block" width="90%" borderBottom="1px solid lightgray"></Box>
                <Typography className={classes.pricing} color="primary" align="center" variant="h5">
                    {props.cost}
                </Typography>
                <Box paddingBottom={1} display="inline-block" width="90%" borderBottom="1px solid lightgray"></Box>
            </Box>
            <CardContent className={classes.cardContent}>
                <Grid container justify="space-between" className={classes.message}>
                    <Typography variant="subtitle1" align="center">
                        {props.message}
                    </Typography>
                </Grid>
                <Box paddingTop={1} marginBottom={1} display="inline-block" width="90%" borderBottom="1px solid lightgray"></Box>
                <Grid container justify="space-between">
                    <Grid>
                        <Typography variant="body2">Geofences</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body2">{props.limitDetails.geofences ? numberWithCommas(props.limitDetails.geofences) : '∞'}</Typography>
                    </Grid>
                </Grid>
                <Grid container justify="space-between">
                    <Grid>
                        <Typography variant="body2">Integrations</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body2">{props.limitDetails.integrations ? numberWithCommas(props.limitDetails.integrations) : '∞'}</Typography>
                    </Grid>
                </Grid>
                <Grid container justify="space-between">
                    <Grid>
                        <Typography variant="body2">Projects</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body2">{props.limitDetails.projects ? numberWithCommas(props.limitDetails.projects) : '∞'}</Typography>
                    </Grid>
                </Grid>
                <Grid container justify="space-between">
                    <Grid>
                        <Typography variant="body2">Accounts</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body2">{props.limitDetails.accounts ? numberWithCommas(props.limitDetails.accounts) : '∞'}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
