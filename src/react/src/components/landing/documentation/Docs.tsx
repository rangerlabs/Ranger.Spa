import * as React from 'react';
import { Theme, Drawer, createStyles, List, ListItem, ListItemText, Typography, Box, makeStyles, useTheme, useMediaQuery, Fade } from '@material-ui/core';
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
import Outline from './docComponents/Outline';
import Constants from '../../../theme/Constants';
import DocRoutePaths from './DocRoutePaths';
import NotFound from '../../error/NotFound';
import { getDocsBreakpoint } from '../../../helpers/Helpers';

const useStyles = makeStyles((theme: Theme) => {
    const breakpoint = getDocsBreakpoint(theme, Constants.DOCS.WIDTH);
    return createStyles({
        drawer: {
            [theme.breakpoints.up(breakpoint)]: {
                width: theme.drawer.width,
                flexShrink: 0,
            },
        },
        mdDownHide: {
            [theme.breakpoints.down(breakpoint)]: {
                display: 'none',
            },
        },
        mdUpHide: {
            [theme.breakpoints.up(breakpoint)]: {
                display: 'none',
            },
        },
        drawerPaper: {
            border: 'none',
            height: 'auto',
            backgroundColor: '#fafafa',
            [theme.breakpoints.up(breakpoint)]: {
                zIndex: theme.zIndex.appBar - 1,
                width: Constants.DRAWER.LANDING.WIDTH,
                maxWidth: Constants.DRAWER.LANDING.WIDTH,
            },
        },
        outlineDrawerPaper: {
            border: 'none',
            height: 'auto',
            backgroundColor: '#fafafa',
            [theme.breakpoints.up(breakpoint)]: {
                zIndex: theme.zIndex.appBar - 1,
                width: 100,
                maxWidth: `calc(50% - ${theme.breakpoints.values.md}px)`,
            },
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        toolbar: theme.mixins.toolbar,
        outlinePush: {
            height: theme.spacing(4),
        },
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
            width: 'auto',
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            [theme.breakpoints.up(breakpoint)]: {
                width: Constants.DOCS.WIDTH,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        sticky: {
            cursor: 'pointer',
            background: 'white',
            position: 'sticky',
            top: '64px',
            zIndex: theme.zIndex.appBar - 1,
        },
        li: {
            paddingLeft: '32px',
        },
        boxShadow: {
            boxShadow: 'none',
        },
    });
});

interface DocumentationProps {
    push: typeof push;
}

function Docs(props: DocumentationProps): JSX.Element {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [atPageTop, setAtPageTop] = useState(true);
    const [isIn, setIsIn] = useState(true);
    const classes = useStyles();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(Constants.DOCS.WIDTH + theme.spacing(2) + Constants.DRAWER.LANDING.WIDTH * 2));
    let match = useRouteMatch();

    const openMobileDrawer = function () {
        setMobileOpen(true);
    };
    const closeMobileDrawer = function () {
        setMobileOpen(false);
    };
    const handleScrollTop = function (inView: boolean) {
        setAtPageTop(inView);
    };

    const handleMenuClick = function (docRoute: string) {
        closeMobileDrawer();
        if (!doc || docRoute !== doc.path) {
            props.push(RoutePaths.Docs.replace(':name?', docRoute));
            setIsIn(false);
        }
    };

    const getDocComponent = function () {
        const nameValue = (match.params as any).name;
        if (nameValue) {
            return DocComponents.find((d) => d.path === nameValue);
        } else {
            return DocComponents.find((d) => d.path === DocRoutePaths.GettingStarted);
        }
    };

    const doc = getDocComponent();

    const drawerContent = (
        <List>
            <ListItem
                id="getting-started-link"
                className={classes.li}
                button
                onClick={() => {
                    handleMenuClick('');
                }}
            >
                <ListItemText primary="Getting Started" />
            </ListItem>
            <ListItem
                id="projects-and-roles-link"
                className={classes.li}
                button
                onClick={() => {
                    handleMenuClick(DocRoutePaths.ProjectsAndRoles);
                }}
            >
                <ListItemText primary="Projects and Roles" />
            </ListItem>
            <ListItem
                id="breadcrumbs-link"
                className={classes.li}
                button
                onClick={() => {
                    handleMenuClick(DocRoutePaths.Breadcrumbs);
                }}
            >
                <ListItemText primary="Breadcrumbs" />
            </ListItem>
            <ListItem
                id="geofences-link"
                className={classes.li}
                button
                onClick={() => {
                    handleMenuClick(DocRoutePaths.Geofences);
                }}
            >
                <ListItemText primary="Geofences" />
            </ListItem>
            <ListItem
                id="integrations-link"
                className={classes.li}
                button
                onClick={() => {
                    handleMenuClick(DocRoutePaths.Integrations);
                }}
            >
                <ListItemText primary="Integrations" />
            </ListItem>
            <ListItem
                id="subscription-link"
                className={classes.li}
                button
                onClick={() => {
                    handleMenuClick(DocRoutePaths.Subscription);
                }}
            >
                <ListItemText primary="Subscription" />
            </ListItem>
            <ListItem
                id="api-link"
                className={classes.li}
                button
                onClick={() => {
                    handleMenuClick(DocRoutePaths.Api);
                }}
            >
                <ListItemText primary="API Reference" />
            </ListItem>
            {/* <ListItem id="sdk-link" className={classes.li} button>
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
            </ListItem> */}
        </List>
    );

    return (
        <React.Fragment>
            <nav className={classes.drawer}>
                <Drawer
                    className={classes.mdUpHide}
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
                    className={classes.mdDownHide}
                    anchor={'left'}
                    variant="permanent"
                    open
                >
                    <div className={classes.toolbar} />
                    {drawerContent}
                </Drawer>
            </nav>
            <div className={classNames(classes.mdUpHide, classes.sticky)} onClick={openMobileDrawer}>
                <Typography style={{ lineHeight: '2.75' }} align="center" variant="subtitle1">
                    {doc ? doc.name : 'Not Found'}
                    <ExpandMore className={classes.iconAlign} />
                </Typography>
            </div>
            <Fade in={isIn} timeout={{ enter: 550, exit: 0 }} addEndListener={() => setIsIn(true)}>
                <div>
                    <div id="content-top" className={classes.content}>
                        <div>
                            <Observer onChange={handleScrollTop}>
                                <div />
                            </Observer>
                            <Box className={classes.mdUpHide}></Box>
                            <div>{doc ? <doc.component showOutline={!isMdUp} /> : <NotFound />}</div>
                        </div>
                    </div>
                    {doc && (
                        <nav className={classes.drawer}>
                            <Drawer
                                classes={{
                                    paper: classNames(classes.outlineDrawerPaper, classes.boxShadow),
                                }}
                                className={classes.mdDownHide}
                                anchor={'right'}
                                variant="permanent"
                                open
                            >
                                <div className={classes.outlinePush} />
                                <div className={classes.outlinePush} />
                                <Outline elements={doc.outline} />
                            </Drawer>
                        </nav>
                    )}
                </div>
            </Fade>
            <ScrollTop
                visible={!atPageTop}
                onClick={() => {
                    document.getElementById('toolbar-push').scrollIntoView({ behavior: 'smooth' });
                }}
            />
            <Footer />
        </React.Fragment>
    );
}

export default connect(null, { push })(Docs);
