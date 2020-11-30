import { PropsWithChildren } from 'react';
import { Theme, createStyles, makeStyles, List, ListItem, ListItemText, Link, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';
import Section from './Section';
import { scrollToLandingId } from '../../../../helpers/Helpers';
import { OutlineElement } from './OutlineElement';
import Constants from '../../../../theme/Constants';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            [theme.breakpoints.up(800 + theme.spacing(2 * 2) + Constants.DRAWER.LANDING.WIDTH * 2)]: {
                paddingTop: theme.spacing(0),
                paddingLeft: theme.spacing(0),
                paddingRight: theme.spacing(0),
            },
            paddingTop: theme.spacing(0),
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
            paddingBottom: theme.spacing(4),
        },
        listItem: {
            root: {
                margin: 0,
            },
            minWidth: theme.spacing(2),
        },
        listItemTextRoot: {
            margin: 0,
        },
        inset: {
            paddingLeft: theme.spacing(4),
        },
        mdUpOutline: {
            paddingLeft: theme.spacing(2),
        },
        toolbar: {
            height: '64px',
        },
        densePadding: {
            paddingTop: '0px',
            paddingBottom: '0px',
        },
    })
);

interface OutlineElementProps {
    elements: OutlineElement[];
}

function getElement(classes: ReturnType<typeof useStyles>, element: OutlineElement, props: OutlineElementProps, inset?: boolean) {
    return (
        <React.Fragment key={element.id}>
            <ListItem className={inset ? classes.inset : ''} classes={{ dense: classes.densePadding }}>
                <ListItemText
                    classes={{ root: inset ? classes.listItemTextRoot : '' }}
                    disableTypography
                    primary={
                        inset ? (
                            <Link component="button" variant="caption" onClick={() => scrollToLandingId(element.id)}>
                                {element.name}
                            </Link>
                        ) : (
                            <Link component="button" variant="body1" onClick={() => scrollToLandingId(element.id)}>
                                {element.name}
                            </Link>
                        )
                    }
                />
            </ListItem>
            {element.subElements && element.subElements.map((subElement) => getElement(classes, subElement, props, true))}
        </React.Fragment>
    );
}

export default function Outline(props: PropsWithChildren<OutlineElementProps>) {
    const classes = useStyles(props);
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(800 + theme.spacing(2 * 2) + Constants.DRAWER.LANDING.WIDTH * 2));
    return (
        <React.Fragment>
            {isMdUp ? (
                <React.Fragment>
                    <div className={classes.toolbar} />
                    <List dense className={classes.list}>
                        {props.elements.map((e) => getElement(classes, e, props))}
                    </List>
                </React.Fragment>
            ) : (
                <Section id="outline-section" text="">
                    <List dense className={classes.list}>
                        {props.elements.map((e) => getElement(classes, e, props))}
                    </List>
                </Section>
            )}
        </React.Fragment>
    );
}
