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
        listItem: {
            minWidth: theme.spacing(2),
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
                    Integrations enable Ranger to communicate to the systems your organiation and services depend on. Ranger's platform was built to be extended
                    and more integrations will come as our team learns our customer's needs. If you would like to request that Ranger integrate with a
                    particular service, send a recommendation to<Link href="mailto:info@rangerlabs.io">info@rangerlabs.io</Link>.
                </Typography>
            </div>
            <Typography className={classes.blockText} variant="h5">
                Outline
            </Typography>
            <div className={classes.blockText}>
                <List dense>
                    <ListItem>
                        <ListItemIcon classes={{ root: classes.listItem }}>
                            <Box fontSize=".65rem">
                                <RadioButtonUncheckedIcon fontSize="inherit" />
                            </Box>
                        </ListItemIcon>
                        <ListItemText
                            disableTypography
                            primary={
                                <Link
                                    onClick={() => {
                                        document.getElementById('webhook-section').scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    Webhooks
                                </Link>
                            }
                        />
                    </ListItem>
                </List>
            </div>
            <Typography id="webhook-section" className={classes.blockText} variant="h5">
                Webhooks
            </Typography>
            <div className={classes.blockText}></div>
        </React.Fragment>
    );
};

export default withStyles(styles)(IntegrationsDoc);
