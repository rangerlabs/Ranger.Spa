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
                Projects and Roles
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    Projects enable your organization to effectively organize geofences and integrations.
                </Typography>
            </div>
            <Typography className={classes.blockText} variant="h5">
                Projects
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    Creating a Project will be the first suggested action in Ranger. Doing so allows access to the Integrations and Geofences sections of the
                    platform. Select a unique name and an optional description for the Project.
                </Typography>
            </div>
            {/* <div className={classes.imgContainer}>
                <img style={{ maxWidth: '70%' }} src={ProjectNew} alt="New Project" />
            </div> */}
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    Once the Project is created you will be presented with three API keys.{' '}
                    <Box display="inline" fontWeight="fontWeightBold">
                        Store these API keys securely. They cannot be recovered.
                    </Box>{' '}
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
                        <ListItemText
                            inset
                            primary="Live API Key"
                            secondary="The Live API Key is intended to be deployed into a production environment and will execute all Integrations whose environent is set to LIVE."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            inset
                            primary="Test API Key"
                            secondary="The Test API Key is intended to be deployed to any non-production environment and will execute all Integrations whose environent is set to TEST."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            inset
                            primary="Project API Key"
                            secondary="The Project API Key provides the ability to programatically manage a subset of resources within a Project. For example, this key can be used for CRUD operations on Geofence resources."
                        />
                    </ListItem>
                </List>
                <Typography gutterBottom variant="body1">
                    Resetting an API Key immediately revokes the previous key - do so with caution.
                </Typography>
            </div>
            <Typography className={classes.blockText} variant="h5">
                Roles
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    There are 4 distinct user Roles within Ranger. What Role a user is given may depend on how frequently your organization's resources need
                    updated or their role in your organization.
                </Typography>
                <Typography gutterBottom variant="body1">
                    Below lists the four roles and their access to resources:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText inset primary="User" />
                        <List>
                            <ListItemText inset primary="Geofences" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Integrations" secondary="Read" />
                            <ListItemText inset primary="Projects" secondary="Read" />
                            <ListItemText inset primary="Subscription" secondary="Read" />
                            <ListItemText inset primary="Organization" secondary="Read" />
                        </List>
                    </ListItem>
                    <ListItem>
                        <ListItemText inset primary="Admin" />
                        <List>
                            <ListItemText inset primary="Geofences" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Integrations" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Projects" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Users" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Subscription" secondary="Read" />
                            <ListItemText inset primary="Organization" secondary="Read" />
                        </List>
                    </ListItem>
                    <ListItem>
                        <ListItemText inset primary="Owner" />
                        <List>
                            <ListItemText inset primary="Geofences" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Integrations" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Projects" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Users" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Admins" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Subscription" secondary="Edit" />
                            <ListItemText inset primary="Organization" secondary="Edit" />
                        </List>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            inset
                            primary="Primary Owner"
                        />
                        <List>
                            <ListItemText inset primary="Geofences" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Integrations" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Projects" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Users" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Admins" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Owners" secondary="Create, Edit, Delete" />
                            <ListItemText inset primary="Subscription" secondary="Edit" />
                            <ListItemText inset primary="Organization" secondary="Edit, Delete" />
                        </List>
                    </ListItem>
                </List>
            </div>
        </React.Fragment>
    );
};

export default withStyles(styles)(ProjectsDoc);
