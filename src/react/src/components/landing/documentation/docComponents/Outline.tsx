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
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(4),
                paddingBottom: theme.spacing(4),
            },
            paddingTop: theme.spacing(0),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
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
        toolbar: {},
    })
);

interface OutlineElementProps {
    elements: OutlineElement[];
}

function getElement(element: OutlineElement, props: OutlineElementProps, inset?: boolean) {
    const classes = useStyles(props);
    return (
        <React.Fragment>
            <ListItem className={inset ? classes.inset : ''}>
                <ListItemText
                    disableTypography
                    primary={
                        inset ? (
                            <Bold>
                                <Link component="button" variant="subtitle1" onClick={() => scrollToLandingId(element.id)}>
                                    {element.name}
                                </Link>
                            </Bold>
                        ) : (
                            <Link component="button" variant="subtitle1" onClick={() => scrollToLandingId(element.id)}>
                                {element.name}
                            </Link>
                        )
                    }
                />
            </ListItem>
            {element.subElements && element.subElements.map((subElement) => getElement(subElement, props, true))}
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
                    <SectionHeader id="outline-section" text="Outline" />
                ) : (
                    <Bold>
                        <Typography gutterBottom variant="subtitle1"></Typography>Outline
                    </Bold>
                )}
            </Block>
            <List dense className={classes.list}>
                {props.elements.map((e) => getElement(e, props))}
            </List>
        </Block>
    );
}
