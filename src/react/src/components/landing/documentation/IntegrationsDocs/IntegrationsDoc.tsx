import React from 'react';
import { Typography, createStyles, Theme, WithStyles, withStyles, Paper, Box, List, ListItem, ListItemText, Grid, Link, ListItemIcon } from '@material-ui/core';
import NewApiKeys from '../../../../assets/new-api-keys.png';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

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
        },
    });

interface IntegrationsDocProps extends WithStyles<typeof styles> {}

const IntegrationsDoc = function (props: IntegrationsDocProps) {
    const { classes } = props;
    return (
        <React.Fragment>
            <Typography className={classes.blockText} variant="h4">
                Integrations
            </Typography>
            <div className={classes.blockText}>
                <Typography className={classes.blockText} variant="body1">
                    Integrations enables Ranger to communicate to the systems your organiation and services depend on. Ranger's platform was built to be
                    extended and more integrations will come as our team learns our customer's needs. If you would like to request that Ranger integrate a
                    platform, drop us a line at <Link href="mailto:info@rangerlabs.io">info@rangerlabs.io</Link>.
                </Typography>
            </div>
            <Typography className={classes.blockText} variant="h5">
                Outline
            </Typography>
            <div className={classes.blockText}>
                <List>
                    <ListItem
                        onClick={() => {
                            document.getElementById('Webhook').scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <ListItemIcon>
                            <RadioButtonUncheckedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Webhook" />
                    </ListItem>
                </List>
            </div>
        </React.Fragment>
    );
};

export default withStyles(styles)(IntegrationsDoc);
