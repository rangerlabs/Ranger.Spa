import * as React from 'react';
import { Theme, WithStyles, Hidden, Drawer, createStyles, withStyles, List, ListItem, ListItemText, Typography, Badge, Paper } from '@material-ui/core';
import Observer from 'react-intersection-observer';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { DocComponents } from './DocComponents';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { useState } from 'react';
import RoutePaths from '../../RoutePaths';

const styles = (theme: Theme) =>
    createStyles({
        drawer: {
            [theme.breakpoints.up('md')]: {
                width: theme.drawer.width,
                flexShrink: 0,
            },
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        mobileSectionMenu: {
            background: 'white',
        },
        toolbar: theme.mixins.toolbar,
        iconAlign: {
            verticalAlign: 'middle',
        },
        badge: {
            height: '100%',
            right: '-25px',
        },
        badgeTypography: {
            lineHeight: 'inherit',
        },
        paper: {
            padding: theme.spacing(4),
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.spacing(3),
            [theme.breakpoints.up(800 + theme.spacing(2 * 2))]: {
                width: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
    });

interface DocumentationProps extends WithStyles<typeof styles> {
    theme: Theme;
    push: typeof push;
}

interface DocumentationState {
    currentSelection: string;
    mobileSectionName: string;
    mobileOpen: boolean;
    atPageTop: boolean;
}

function Docs(props: DocumentationProps): JSX.Element {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [atPageTop, setAtPageTop] = useState(true);
    const [currentSelection, setCurrentSelection] = useState('');
    const [mobileSectionName, setMobileSectionName] = useState('Getting Started');
    let match = useRouteMatch();

    const handleMenuToggle = function (name: string) {
        setCurrentSelection(currentSelection === name ? '' : name);
    };

    const openMobileDrawer = function () {
        setMobileOpen(true);
    };
    const closeMobileDrawer = function () {
        setMobileOpen(false);
    };
    const handleScrollTop = function (inView: boolean) {
        setAtPageTop(inView);
    };

    const { classes, theme } = props;
    const docComponents = DocComponents;
    const { component: Doc } = docComponents.find((d) => d.name === (match.params as any).name) ?? docComponents.find((d) => d.name === 'getting-started');

    const drawerContent = (
        <List>
            <ListItem
                id="getting-started-link"
                button
                onClick={() => {
                    closeMobileDrawer();
                    props.push(RoutePaths.Docs.replace('/:name?', ''));
                }}
            >
                <ListItemText primary="Getting Started" />
            </ListItem>
            <ListItem
                id="projects-link"
                button
                onClick={() => {
                    closeMobileDrawer();
                    props.push(RoutePaths.Docs.replace(':name?', 'projects'));
                }}
            >
                <ListItemText primary="Projects" />
            </ListItem>
            <ListItem
                id="projects-link"
                button
                onClick={() => {
                    closeMobileDrawer();
                }}
            >
                <ListItemText primary="Geofences" />
            </ListItem>
            <ListItem
                id="integrations-link"
                button
                onClick={() => {
                    closeMobileDrawer();
                }}
            >
                <ListItemText primary="Integrations" />
            </ListItem>
            <ListItem
                id="api-link"
                button
                onClick={() => {
                    closeMobileDrawer();
                }}
            >
                <ListItemText primary="API" />
            </ListItem>
            <ListItem id="sdk-link" button>
                <Badge
                    classes={{ badge: classes.badge }}
                    badgeContent={
                        <Typography className={classes.badgeTypography} variant="caption" align="center">
                            Coming soon
                        </Typography>
                    }
                    color="primary"
                >
                    <ListItemText primary="SDK" />
                </Badge>
            </ListItem>
        </List>
    );

    return (
        <React.Fragment>
            <nav>
                <Hidden mdUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={'top'}
                        open={mobileOpen}
                        onClose={closeMobileDrawer}
                        
                        SlideProps={{
                            timeout: { enter: theme.drawer.enterDuration, exit: theme.drawer.leavingDuration },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                       }
                        anchor={'left'}
                        elevation={3}
                        variant="permanent"
                        open
                    >
                        <div>
                            <div className={classes.toolbar} />
                            {drawerContent}
                        </div>
                    </Drawer>
                </Hidden>
            </nav>
            <Hidden mdUp implementation="css">
                <div onClick={openMobileDrawer}>
                    <Typography align="center" variant="subtitle1">
                        {mobileSectionName}
                        <ExpandMore className={classes.iconAlign} />
                    </Typography>
                </div>
            </Hidden>
            <Paper elevation={3} className={classes.paper}>
                <Observer onChange={handleScrollTop}>
                    <div />
                </Observer>
                <Doc />
            </Paper>
        </React.Fragment>
    );
}

export default connect(null, { push })(withStyles(styles, { withTheme: true })(Docs));
