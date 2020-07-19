import * as React from 'react';
import {
    Theme,
    WithStyles,
    Hidden,
    Drawer,
    createStyles,
    withStyles,
    List,
    ListItem,
    ListItemText,
    Typography,
    Badge,
    Box,
    makeStyles,
    useTheme,
    useMediaQuery,
} from '@material-ui/core';
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            [theme.breakpoints.up(800 + theme.spacing(2 * 2) + Constants.DRAWER.LANDING.WIDTH * 2)]: {
                width: theme.drawer.width,
                flexShrink: 0,
            },
        },
        mdDownHide: {
            [theme.breakpoints.down(800 + theme.spacing(2 * 2) + Constants.DRAWER.LANDING.WIDTH * 2)]: {
                display: 'none',
            },
        },
        mdUpHide: {
            [theme.breakpoints.up(800 + theme.spacing(2 * 2) + Constants.DRAWER.LANDING.WIDTH * 2)]: {
                display: 'none',
            },
        },
        drawerPaper: {
            border: 'none',
            height: 'auto',
            backgroundColor: '#fafafa',
            [theme.breakpoints.up(800 + theme.spacing(2 * 2) + Constants.DRAWER.LANDING.WIDTH * 2)]: {
                zIndex: theme.zIndex.appBar - 1,
                width: Constants.DRAWER.LANDING.WIDTH,
                Maxwidth: Constants.DRAWER.LANDING.WIDTH,
            },
            zIndex: 'inherit',
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
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
            [theme.breakpoints.up(800 + theme.spacing(2 * 2) + Constants.DRAWER.LANDING.WIDTH * 2)]: {
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
    })
);

interface DocumentationProps {
    push: typeof push;
}

function Docs(props: DocumentationProps): JSX.Element {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [atPageTop, setAtPageTop] = useState(true);
    const classes = useStyles();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(800 + theme.spacing(2 * 2) + Constants.DRAWER.LANDING.WIDTH * 2));
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

    const docComponents = DocComponents;
    const { component: Doc, name: Name, outline: DocOutline } =
        docComponents.find((d) => d.path === (match.params as any).name) ?? docComponents.find((d) => d.path === 'getting-started');

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
                id="projects-and-roles-link"
                className={classes.li}
                button
                onClick={() => {
                    closeMobileDrawer();
                    props.push(RoutePaths.Docs.replace(':name?', 'projects-and-roles'));
                }}
            >
                <ListItemText primary="Projects and Roles" />
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
                id="breadcrumbs-link"
                className={classes.li}
                button
                onClick={() => {
                    closeMobileDrawer();
                    props.push(RoutePaths.Docs.replace(':name?', 'breadcrumbs'));
                }}
            >
                <ListItemText primary="Breadcrumbs" />
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
                    {Name}
                    <ExpandMore className={classes.iconAlign} />
                </Typography>
            </div>
            <div id="content-top" className={classes.content}>
                <div>
                    <Observer onChange={handleScrollTop}>
                        <div />
                    </Observer>
                    <Box className={classes.mdUpHide}></Box>
                    <Doc showOutline={!isMdUp} />
                </div>
            </div>
            <nav className={classes.drawer}>
                <Drawer
                    classes={{
                        paper: classNames(classes.drawerPaper, classes.boxShadow),
                    }}
                    className={classes.mdDownHide}
                    anchor={'right'}
                    variant="permanent"
                    open
                >
                    <div className={classes.toolbar} />
                    <Outline elements={DocOutline} />
                </Drawer>
            </nav>
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
