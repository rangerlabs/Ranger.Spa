import React from 'react';
import { Typography, createStyles, Theme, WithStyles, withStyles, Paper, Box, List, ListItem, ListItemText } from '@material-ui/core';
import NewApiKeys from '../../../../assets/new-api-keys.png';

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
                <Typography gutterBottom variant="body1">
                    Creating a project will be the first suggested action in Ranger. Doing so allows access to the Integrations and Geofences sections of the
                    platform. Select a unique name an optional description for the project.
                </Typography>
            </div>
            {/* <div className={classes.imgContainer}>
                <img style={{ maxWidth: '70%' }} src={ProjectNew} alt="New Project" />
            </div> */}
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    Once the project is created you will be presented with three API keys.{' '}
                    <Box display="inline" fontWeight="fontWeightBold">
                        <Typography display="inline" variant="body1">
                            Store these API keys securely. They cannot be recovered.
                        </Typography>
                    </Box>
                    API keys can only be re-generated.
                </Typography>
            </div>
            <div className={classes.imgContainer}>
                <img style={{ maxWidth: '70%' }} src={NewApiKeys} alt="New API Keys" />
            </div>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    These API Keys represent distinct purposes within Ranger as described below:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="Live API Key" />
                        <ListItemText
                            inset
                            primary="The Live API Key is intended to be deployed into a production environment and will execute all Integrations whose environent is set to LIVE."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Test API Key" />
                        <ListItemText
                            inset
                            primary="The Test API Key is intended to be deployed to any non-production environment and will execute all Integrations whose environent is set to TEST."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Project API Key" />
                        <ListItemText
                            inset
                            primary="The Project API Key provides the ability to programatically manage a subset of resources within a project. For Example, this key can be used CRUD operations on Geofence resources."
                        />
                    </ListItem>
                </List>
            </div>
        </React.Fragment>
    );
};

export default withStyles(styles)(ProjectsDoc);
