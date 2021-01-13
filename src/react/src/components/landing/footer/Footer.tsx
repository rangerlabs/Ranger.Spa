import * as React from 'react';
import { Container, Grid, Box, Link, Typography, makeStyles, Theme } from '@material-ui/core';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import DocRoutePaths from '../documentation/DocRoutePaths';
import { connect } from 'react-redux';

interface FooterLink {
    name: string;
    url: string;
}
interface FooterSection {
    title: string;
    description: FooterLink[];
}

const footers = [
    {
        title: 'Company',
        description: [
            { name: 'About', url: RoutePaths.About },
            { name: 'Contact us', url: RoutePaths.Contact },
        ],
    },
    {
        title: 'Social',
        description: [
            { name: 'LinkedIn', url: 'https://www.linkedin.com/company/ranger-labs/' },
            { name: 'Twitter', onClick: () => window.location.assign('https://twitter.com/RangerLabs') },
            { name: 'StatusPage', url: 'https://rangerlabs.statuspage.io/' },
        ],
    },
    {
        title: 'Docs',
        description: [
            { name: 'Getting Started', url: RoutePaths.Docs.replace(':name?', DocRoutePaths.GettingStarted) },
            { name: 'Projects', url: RoutePaths.Docs.replace(':name?', DocRoutePaths.ProjectsAndRoles) },
            { name: 'Geofences', url: RoutePaths.Docs.replace(':name?', DocRoutePaths.Geofences) },
            { name: 'Integrations', url: RoutePaths.Docs.replace(':name?', DocRoutePaths.Integrations) },
            { name: 'Breadcrumbs', url: RoutePaths.Docs.replace(':name?', DocRoutePaths.Breadcrumbs) },
            { name: 'API Reference', url: RoutePaths.Docs.replace(':name?', DocRoutePaths.Api) },
        ],
    },
    {
        title: 'Legal',
        description: [
            { name: 'Privacy policy', url: RoutePaths.Privacy },
            { name: 'Terms of use', url: RoutePaths.TermsOfUse },
            { name: 'DPA', url: RoutePaths.DataProcessingAddendum },
        ],
    },
] as FooterSection[];

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
            <Link component="button" color="inherit" href="https://rangerlabs.io/" variant="body2">
                Ranger Labs, LLC.
            </Link>{' '}
        </Typography>
    );
}

interface FooterProps {
    push: typeof push;
}

const Footer = function (props: FooterProps) {
    const classes = useStyles();

    const navigate = function (url: string) {
        if (url.startsWith('/')) {
            props.push(url);
        } else {
            window.location.assign(url);
        }
    };

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
                                            <Link component="button" onClick={() => navigate(item.url)} variant="subtitle1" color="textSecondary">
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
};

export default connect(null, { push })(Footer);
