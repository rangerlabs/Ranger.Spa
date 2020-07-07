import * as React from 'react';
import { Container, Grid, Box, Link, Typography, makeStyles, Theme } from '@material-ui/core';

const footers = [
    {
        title: 'Company',
        description: ['About us', 'Contact us'],
    },
    // {
    //     title: 'Features',
    //     description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
    // },
    {
        title: 'Docs',
        description: ['Getting Started', 'Projects', 'Geofences', 'Integrations', 'API'],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use'],
    },
];

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
}));

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Ranger Labs, LLC
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Footer() {
    const classes = useStyles();

    return (
        <Container maxWidth="md" component="footer" className={classes.footer}>
            <Grid container spacing={4} justify="space-evenly">
                {footers.map((footer) => (
                    <Grid item xs={6} sm={3} key={footer.title}>
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
    );
}
