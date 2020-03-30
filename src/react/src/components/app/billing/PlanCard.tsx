import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link, Box, CardHeader, Button } from '@material-ui/core';
import Constants from '../../../theme/Constants';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 345,
        },
        header: {
            height: 140,
            backgroundColor: Constants.COLORS.PRIMARY_COLOR,
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
    onUpgrade: (event: any) => void;
}

export default function PlanCard(props: PlanCardProps) {
    const classes = useStyles(props);

    return (
        <Card elevation={3} className={classes.root}>
            <Box className={classes.header} paddingTop={4}>
                <Typography className={classes.white} align="center" gutterBottom variant="h4">
                    {props.planName}
                </Typography>
                <Typography className={classes.white} align="center" gutterBottom variant="h6">
                    {props.cost}
                </Typography>
            </Box>
            <CardContent>
                <Typography variant="body2" component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica
                </Typography>
            </CardContent>
            <CardActions className={classes.buttons}>
                <Button onClick={props.onUpgrade} variant="outlined" data-cb-type="checkout" data-cb-plan-id={props.planId}>
                    Upgrade
                </Button>
            </CardActions>
        </Card>
    );
}
