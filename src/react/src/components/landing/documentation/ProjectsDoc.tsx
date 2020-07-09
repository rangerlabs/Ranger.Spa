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

interface ProjectsDocProps extends WithStyles<typeof styles> {}

const ProjectsDoc = function (props: ProjectsDocProps) {
    const { classes } = props;
    return (
        <React.Fragment>
            <Typography className={classes.blockText} variant="h4">
                Projects
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    Projects enable your organization to effectively organize geofences and integrations.
                </Typography>
            </div>
            <Typography className={classes.blockText} variant="h5">
                Creating a New Project
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1"></Typography>
                <Typography gutterBottom variant="body1"></Typography>
            </div>
            {/* <div className={classes.imgContainer}>
                <img style={{ maxWidth: '70%' }} src={''} alt="central-park-geofence" />
            </div> */}
        </React.Fragment>
    );
};

export default withStyles(styles)(ProjectsDoc);
