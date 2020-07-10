import React from 'react';
import { Typography, createStyles, Theme, WithStyles, withStyles, Paper, Box, List, ListItem, ListItemText, Grid } from '@material-ui/core';
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
        list: {
            padding: theme.spacing(4),
            background: 'white',
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
            <Paper elevation={3}>
                <div className={classes.imgContainer}>
                    <img style={{ maxWidth: '70%' }} src={NewApiKeys} alt="New API Keys" />
                </div>
            </Paper>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    These API Keys represent distinct purposes within Ranger as described below:
                </Typography>

                <List className={classes.list}>
                    <ListItem>
                        <ListItemText
                            primary="Live API Key"
                            secondary="The Live API Key is intended to be deployed into a production environment and will execute all Integrations whose environent is set to LIVE."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Test API Key"
                            secondary="The Test API Key is intended to be deployed to any non-production environment and will execute all Integrations whose environent is set to TEST."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
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
                    Below lists the four roles and their access to Ranger's APIs:
                </Typography>
                <Grid container xs={12} justify="space-evenly" spacing={1} />
                <Grid item xs={2}>
                    <Typography color="primary" variant="h6">
                        Users
                    </Typography>
                    <List>
                        <ListItemText primary="Geofences" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Integrations" secondary="Read" />
                        <ListItemText primary="Projects" secondary="Read" />
                        <ListItemText primary="Subscription" secondary="Read" />
                        <ListItemText primary="Organization" secondary="Read" />
                    </List>
                </Grid>
                <Grid item xs={2}>
                    <Typography color="primary" variant="h6">
                        Admins
                    </Typography>
                    <List>
                        <ListItemText primary="Geofences" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Integrations" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Projects" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Users" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Subscription" secondary="Read" />
                        <ListItemText primary="Organization" secondary="Read" />
                    </List>
                </Grid>
                <Grid item xs={2}>
                    <Typography color="primary" variant="h6">
                        Owners
                    </Typography>
                    <List>
                        <ListItemText primary="Geofences" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Integrations" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Projects" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Users" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Admins" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Subscription" secondary="Edit" />
                        <ListItemText primary="Organization" secondary="Edit" />
                    </List>
                </Grid>
                <Grid item xs={2}>
                    <Typography color="primary" variant="h6">
                        Primary Owner
                    </Typography>
                    <List>
                        <ListItemText primary="Geofences" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Integrations" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Projects" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Users" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Admins" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Owners" secondary="Create, Edit, Delete" />
                        <ListItemText primary="Subscription" secondary="Edit" />
                        <ListItemText primary="Organization" secondary="Edit, Delete" />
                    </List>
                </Grid>
            </div>
        </React.Fragment>
    );
};

export default withStyles(styles)(ProjectsDoc);
