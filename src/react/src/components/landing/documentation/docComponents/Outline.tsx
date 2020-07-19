import { PropsWithChildren } from 'react';
import { Theme, createStyles, makeStyles, Paper, List, ListItem, ListItemIcon, Box, ListItemText, Link } from '@material-ui/core';
import React from 'react';
import Block from './Block';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import SectionHeader from './SectionHeader';
import { scrollToLandingId } from '../../../../helpers/Helpers';
import { OutlineElement } from './OutlineElement';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            paddingTop: theme.spacing(0),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            paddingBottom: theme.spacing(4),
        },
        listItem: {
            minWidth: theme.spacing(2),
        },
        inset: {
            paddingLeft: theme.spacing(4),
        },
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
                        <Link component="button" variant={inset ? 'body1' : 'subtitle1'} onClick={() => scrollToLandingId(element.id)}>
                            {element.name}
                        </Link>
                    }
                />
            </ListItem>
            {element.subElements && element.subElements.map((subElement) => getElement(subElement, props, true))}
        </React.Fragment>
    );
}

export default function Outline(props: PropsWithChildren<OutlineElementProps>) {
    const classes = useStyles(props);
    return (
        <Block>
            <Block>
                <SectionHeader text="Outline" />
            </Block>
            <List dense className={classes.list}>
                {props.elements.map((e) => getElement(e, props))}
            </List>
        </Block>
    );
}
