import React from 'react';
import { Grid, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import Finance from 'mdi-material-ui/Finance';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            background: theme.palette.primary.main,
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8),
        },
        white: {
            color: theme.palette.common.white,
        },
    })
);

interface PurposeSectionProps {}

const PurposeSection = function (props: PurposeSectionProps) {
    const classes = useStyles(props);
    return (
        <div className={classes.layout}>
            <Grid container alignContent="center" justify="center" spacing={5}>
                <Grid item xs={10} md={8}>
                    <Typography className={classes.white} gutterBottom color="primary" align="center" variant="h4">
                        <Finance fontSize="large" />
                    </Typography>
                    <Typography className={classes.white} gutterBottom color="primary" align="center" variant="h4">
                        Drive Growth And Streamline Development
                    </Typography>
                    <Typography className={classes.white} gutterBottom color="primary" align="center" variant="h6">
                        Grow existing revenue streams and create new ones with location aware mobile app experiences. With Ranger, your development and
                        marketing teams can create, configure, and test geofences in the cloud that seamlessly integrate with your APIs.
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};
export default PurposeSection;
