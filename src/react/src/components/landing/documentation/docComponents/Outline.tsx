import { PropsWithChildren } from 'react';
import { Theme, createStyles, makeStyles, Paper, List, ListItem, ListItemText, Link, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';
import Block from './Block';
import SectionHeader from './SectionHeader';
import { scrollToLandingId } from '../../../../helpers/Helpers';
import { OutlineElement } from './OutlineElement';
import Bold from '../TextEnhancers/Bold';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            [theme.breakpoints.up(800 + theme.spacing(2 * 2) + (theme.drawer.width as number))]: {
                paddingTop: theme.spacing(0),
                paddingLeft: theme.spacing(2),
                paddingRight: theme.spacing(2),
            },
            paddingTop: theme.spacing(0),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            paddingBottom: theme.spacing(4),
        },
        listItem: {
            root: {
                margin: 0,
            },
            minWidth: theme.spacing(2),
        },
        inset: {
            paddingLeft: theme.spacing(4),
        },
        toolbar: theme.mixins.toolbar,
    })
);

interface OutlineElementProps {
    elements: OutlineElement[];
}

function getElement(classes: ReturnType<typeof useStyles>, element: OutlineElement, props: OutlineElementProps, inset?: boolean) {
    return (
        <React.Fragment>
            <ListItem className={inset ? classes.inset : ''}>
                <ListItemText
                    disableTypography
                    primary={
                        inset ? (
                            <Link component="button" variant="subtitle1" onClick={() => scrollToLandingId(element.id)}>
                                <Bold>{element.name}</Bold>
                            </Link>
                        ) : (
                            <Link component="button" variant="subtitle1" onClick={() => scrollToLandingId(element.id)}>
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
    const isMdUp = useMediaQuery(theme.breakpoints.up(800 + theme.spacing(2 * 2) + (theme.drawer.width as number)));
    return (
        <Block>
            <Block>
                {isMdUp ? (
                    <React.Fragment>
                        <div className={classes.toolbar} />
                        <Bold>
                            <Typography gutterBottom variant="subtitle1">
                                Outline
                            </Typography>
                        </Bold>
                    </React.Fragment>
                ) : (
                    <SectionHeader id="outline-section" text="Outline" />
                )}
            </Block>
            <List dense className={classes.list}>
                {props.elements.map((e) => getElement(classes, e, props))}
            </List>
        </Block>
    );
}
