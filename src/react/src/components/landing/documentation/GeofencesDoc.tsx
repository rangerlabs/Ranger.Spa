import React from 'react';
import { Typography, createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';

const styles = (theme: Theme) =>
    createStyles({
        blockText: {
            marginBottom: theme.spacing(3),
        },
        imgContainer: {
            textAlign: 'center',
            marginBottom: theme.spacing(3),
        },
    });

interface GeofencesDocProps extends WithStyles<typeof styles> {}

const ProjectsDoc = function (props: GeofencesDocProps) {
    const { classes } = props;
    return (
        <React.Fragment>
            <Typography className={classes.blockText} variant="h4">
                Geofences
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1"></Typography>
                <Typography variant="body1"></Typography>
            </div>
        </React.Fragment>
    );
};

export default withStyles(styles)(ProjectsDoc);
