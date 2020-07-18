import * as React from 'react';
import { Container, Grid, Box, Link, Typography, makeStyles, Theme, CssBaseline } from '@material-ui/core';
import { string } from 'yup';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import DocRoutePaths from '../documentation/DocRoutePaths';

interface FooterLink {
    name: string;
    onClick: () => void;
}
interface FooterSection {
    title: string;
    description: FooterLink[];
}

const footers = [
    {
        title: 'Company',
        description: [
            { name: 'About', onClick: () => push(RoutePaths.About) },
            { name: 'Contact us', onClick: () => push(RoutePaths.Contact) },
        ],
    },
    {
        title: 'Social',
        description: [
            { name: 'LinkedIn', onClick: () => (window.location.href = 'https://www.linkedin.com/company/ranger-labs/') },
            // { name: 'Twitter', onClick: () => (window.location.href = 'https://twitter.com/RangerLabs') },
            { name: 'StatusPage', onClick: () => (window.location.href = 'https://rangerlabs.statuspage.io/') },
        ],
    },
    {
        title: 'Docs',
        description: [
            { name: 'Getting Started', onClick: () => push(RoutePaths.Docs.replace(':name?', DocRoutePaths.GettingStarted)) },
            { name: 'Projects', onClick: () => push(RoutePaths.Docs.replace(':name?', DocRoutePaths.ProjectsAndRoles)) },
            { name: 'Geofences', onClick: () => push(RoutePaths.Docs.replace(':name?', DocRoutePaths.Geofences)) },
            { name: 'Integraions', onClick: () => push(RoutePaths.Docs.replace(':name?', DocRoutePaths.Integrations)) },
            { name: 'Breadcrumbs', onClick: () => push(RoutePaths.Docs.replace(':name?', DocRoutePaths.Breadcrumbs)) },
        ],
    },
    {
        title: 'Legal',
        description: [
            { name: 'Privacy policy', onClick: () => {} },
            { name: 'Terms of use', onClick: () => {} },
        ],
    },
] as FooterSection[];

// description: [{name: 'LinkedIn', url: 'https://www.linkedin.com/company/ranger-labs/'}, {name:'Twitter', url: 'https://twitter.com/RangerLabs'}, {name:'StatusPage', url: 'https://rangerlabs.statuspage.io/'}] as FooterLink[],
const useStyles = makeStyles((theme: Theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    footer: {
        backgroundColor: '#fafafa',
        paddingTop: theme.spacing(8),
        maxWidth: '100%',
    },
    content: {
        borderTop: `1px solid ${theme.palette.divider}`,
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
    alignCenter: {
        textAlign: 'center',
    },
}));

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'© '}
            {new Date().getFullYear()}{' '}
            <Link color="inherit" href="https://rangerlabs.io/">
                Ranger Labs, LLC.
            </Link>{' '}
        </Typography>
    );
}

export default function Footer() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Container className={classes.footer} component="footer">
                <Container maxWidth="md" className={classes.content}>
                    <Grid container spacing={4} justify="space-evenly">
                        {footers.map((footer) => (
                            <Grid className={classes.alignCenter} item xs={6} sm={3} key={footer.title}>
                                <Typography variant="h6" color="textPrimary" gutterBottom>
                                    {footer.title}
                                </Typography>
                                <ul>
                                    {footer.description.map((item) => (
                                        <li key={item.name}>
                                            <Link onClick={item.onClick} variant="subtitle1" color="textSecondary">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Grid>
                        ))}
                    </Grid>
                    <Box mt={5}>
                        <Copyright />
                    </Box>
                </Container>
            </Container>
        </React.Fragment>
    );
}
