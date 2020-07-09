import * as React from 'react';
import { Theme, WithStyles, Hidden, Drawer, createStyles, withStyles, List, ListItem, ListItemText, Typography, Badge } from '@material-ui/core';
import Observer from 'react-intersection-observer';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { DocComponents } from './DocComponents';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { useState } from 'react';
import RoutePaths from '../../RoutePaths';
import classNames from 'classnames';
import ScrollTop from '../ScrollTop';
import Footer from '../footer/Footer';

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            background: 'white',
        },
        drawer: {
            [theme.breakpoints.up(800 + theme.spacing(2 * 2) + (theme.drawer.width as number))]: {
                width: theme.drawer.width,
                flexShrink: 0,
            },
        },
        smHide: {
            [theme.breakpoints.down(800 + theme.spacing(2 * 2) + (theme.drawer.width as number))]: {
                display: 'none',
            },
        },
        mdHide: {
            [theme.breakpoints.up(800 + theme.spacing(2 * 2) + (theme.drawer.width as number))]: {
                display: 'none',
            },
        },
        drawerPaper: {
            border: 'none',
            height: 'auto',
            backgroundColor: '#fafafa',
            [theme.breakpoints.up(800 + theme.spacing(2 * 2) + (theme.drawer.width as number))]: {
                zIndex: theme.zIndex.appBar - 1,
                width: theme.drawer.width,
            },
        },
        nested: {
            paddingLeft: theme.spacing(4),
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
        content: {
            backgroundColor: '#fafafa',
            padding: theme.spacing(4),
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
            [theme.breakpoints.up(800 + theme.spacing(2 * 2) + (theme.drawer.width as number))]: {
                width: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        sticky: {
            cursor: 'pointer',
            background: 'white',
            position: 'sticky',
            top: '64px',
        },
        li: {
            paddingLeft: '32px',
        },
        boxShadow: {
            boxShadow: 'none',
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
                className={classes.li}
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
                className={classes.li}
                button
                onClick={() => {
                    closeMobileDrawer();
                    props.push(RoutePaths.Docs.replace(':name?', 'projects'));
                }}
            >
                <ListItemText primary="Projects" />
            </ListItem>
            <ListItem
                id="geofences-link"
                className={classes.li}
                button
                onClick={() => {
                    closeMobileDrawer();
                    props.push(RoutePaths.Docs.replace(':name?', 'geofences'));
                }}
            >
                <ListItemText primary="Geofences" />
            </ListItem>
            <ListItem
                id="integrations-link"
                className={classes.li}
                button
                onClick={() => {
                    closeMobileDrawer();
                    props.push(RoutePaths.Docs.replace(':name?', 'integrations'));
                }}
            >
                <ListItemText primary="Integrations" />
            </ListItem>
            <ListItem
                id="api-link"
                className={classes.li}
                button
                onClick={() => {
                    closeMobileDrawer();
                }}
            >
                <ListItemText primary="API" />
            </ListItem>
            <ListItem id="sdk-link" className={classes.li} button>
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
            <div className={classes.layout}>
                <nav className={classes.drawer}>
                    <Drawer
                        className={classes.mdHide}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
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
                    <Drawer
                        classes={{
                            paper: classNames(classes.drawerPaper, classes.boxShadow),
                        }}
                        className={classes.smHide}
                        anchor={'left'}
                        variant="permanent"
                        open
                    >
                        <div className={classes.toolbar} />
                        {drawerContent}
                    </Drawer>
                </nav>
                <div className={classNames(classes.mdHide, classes.sticky)} onClick={openMobileDrawer}>
                    <Typography align="center" variant="subtitle1">
                        {mobileSectionName}
                        <ExpandMore className={classes.iconAlign} />
                    </Typography>
                </div>
                <div id="content-top" className={classes.content}>
                    <Observer onChange={handleScrollTop}>
                        <div />
                    </Observer>
                    <Doc />
                </div>
                <ScrollTop
                    visible={!atPageTop}
                    onClick={() => {
                        document.getElementById('toolbar-push').scrollIntoView({ behavior: 'smooth' });
                    }}
                />
            </div>
            <Footer />
        </React.Fragment>
    );
}

export default connect(null, { push })(withStyles(styles, { withTheme: true })(Docs));
