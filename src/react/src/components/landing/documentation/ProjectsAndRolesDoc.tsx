import React from 'react';
import { Typography, createStyles, Theme, List, ListItem, ListItemText, Grid, makeStyles } from '@material-ui/core';
import NewApiKeys from '../../../../assets/new-api-keys.png';
import NewUser from '../../../../assets/new-user.png';
import Header from './docComponents/Header';
import Block from './docComponents/Block';
import Paragraph from './docComponents/Paragraph';
import SectionHeader from './docComponents/SectionHeader';
import Image from './docComponents/Image';
import Bold from './TextEnhancers/Bold';
import { OutlineElement } from './docComponents/OutlineElement';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            padding: theme.spacing(4),
        },
    })
);

export const ProjectsAndRolesDocOutline = [
    {
        name: 'Projects And Roles',
        id: 'projects-and-roles-section',
    },
    {
        name: 'Projects',
        id: 'projects-section',
    },
    {
        name: 'Roles',
        id: 'roles-section',
    },
] as OutlineElement[];

interface ProjectsAndRolesDocProps {}
function ApiKeyDescriptions(props: ProjectsAndRolesDocProps) {
    const classes = useStyles(props);
    return (
        <List className={classes.list}>
            <ListItem>
                <ListItemText
                    primary="Live API key"
                    secondary="The Live API key is intended to be deployed into a production environment and will execute all Integrations whose environent is set to LIVE."
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Test API key"
                    secondary="The Test API key is intended to be deployed to any non-production environment and will execute all Integrations whose environent is set to TEST."
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Project API key"
                    secondary="The Project API key provides the ability to programatically manage a subset of resources within a Project. For example, this key can be used for CRUD operations on Geofence resources."
                />
            </ListItem>
        </List>
    );
}

function Roles() {
    return (
        <Grid container xs={12} justify="space-evenly" spacing={1}>
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
        </Grid>
    );
}

const ProjectsDoc = function (props: IDocProps) {
    const { outline: OutlineElement } = props;
    return (
        <React.Fragment>
            <Header id="projects-and-roles-section" text="Projects and Roles" />
            <Block>
                <Paragraph>
                    Projects enable your organization to effectively organize geofences and integrations. Depending on your use case, Projects may be scoped to
                    a mobile app, customer, or organizational unit.
                </Paragraph>
            </Block>
            <OutlineElement />
            <SectionHeader id="projects-section" text="Projects" />
            <Block>
                <Paragraph>
                    Creating a Project will be the first suggested action in Ranger. Doing so allows access to the Integrations and Geofences sections of the
                    platform. Select a unique name and an optional description for the Project.
                </Paragraph>
            </Block>
            <Block>
                <Paragraph>
                    Once the Project is created you will be presented with three API keys. <Bold>Store these API keys securely. They cannot be recovered.</Bold>
                    API keys can only be re-generated.
                </Paragraph>
            </Block>
            <Image src={NewApiKeys} alt="New Api Keys" />
            <Block>
                <Paragraph>These API keys serve distinct purposes:</Paragraph>
                <ApiKeyDescriptions />
            </Block>
            <Block>
                <Paragraph>Resetting an API key immediately revokes the previous key - do so with caution.</Paragraph>
            </Block>
            <SectionHeader id="roles-section" text="Roles" />
            <Block>
                <Paragraph>
                    There are 4 distinct user Roles within Ranger. What Role a user is given may depend on how frequently your organization's resources need
                    updated or their role in your organization.
                </Paragraph>
                <Paragraph>Below lists the four roles and their access to Ranger's APIs:</Paragraph>
            </Block>
            <Block>
                <Roles />
            </Block>
            <Block>
                <Paragraph>
                    The User Role is only able to perform operations on resources that are contained within the Projects they have been assigned to.
                </Paragraph>
                <Paragraph>Projects can be assigned using the 'Authorized Projects' multiselect dropdown when creating or editing users.</Paragraph>
            </Block>
            <Image src={NewUser} alt="New User" />
        </React.Fragment>
    );
};

export default ProjectsDoc;
