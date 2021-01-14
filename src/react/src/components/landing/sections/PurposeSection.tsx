import React from 'react';
import { Grid, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8),
        },
    })
);

interface PurposeSectionProps {}

const PurposeSection = function (props: PurposeSectionProps) {
    const classes = useStyles(props);
    return (
        <div className={classes.layout}>
            <Grid container alignContent="center" justify="center" spacing={5}>
                <Grid item xs={12}>
                    <Typography gutterBottom color="primary" align="center" variant="h4">
                        Break Free From Native Geofencing Limitations
                    </Typography>
                    <Typography gutterBottom color="primary" align="center" variant="h6">
                        Free your organization from the need to develop proprietary pipelines for the management of iOS and Android geofences. With Ranger, your
                        development and marketing teams can create, configure, and test geofences that seamlessly integrate with your platform.
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};
export default PurposeSection;
