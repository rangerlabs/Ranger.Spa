import * as React from 'react';
import { Container, Grid, Box, Link, Typography, makeStyles, Theme, CssBaseline } from '@material-ui/core';

interface FooterLink {
    name: string;
    url: string;
}

const footers = [
    {
        title: 'Company',
        description: ['About', 'Contact us'],
    },
    {
        title: 'Social',
        description: ['LinkedIn', 'Twitter', 'StatusPage'],
    },
    {
        title: 'Docs',
        description: ['Getting Started', 'Projects', 'Geofences', 'Integrations', 'API'],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use'],
    },
];

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
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
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
            <CssBaseline />
            <Container maxWidth="md" component="footer" className={classes.footer}>
                <Grid container spacing={4} justify="space-evenly">
                    {footers.map((footer) => (
                        <Grid className={classes.alignCenter} item xs={6} sm={3} key={footer.title}>
                            <Typography variant="h6" color="textPrimary" gutterBottom>
                                {footer.title}
                            </Typography>
                            <ul>
                                {footer.description.map((item) => (
                                    <li key={item}>
                                        <Link href="#" variant="subtitle1" color="textSecondary">
                                            {item}
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
        </React.Fragment>
    );
}
