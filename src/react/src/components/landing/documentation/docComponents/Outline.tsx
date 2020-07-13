import { PropsWithChildren } from 'react';
import { Theme, createStyles, makeStyles, Paper, List, ListItem, ListItemIcon, Box, ListItemText, Link } from '@material-ui/core';
import React from 'react';
import Block from './Block';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import SectionHeader from './SectionHeader';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            padding: theme.spacing(4),
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

interface OutlineElement {
    name: string;
    id: string;
    subElements?: OutlineElement[];
}

function scrollToId(id: string) {
    const headerOffset = -64;
    var element = document.getElementById(id);
    const y = element.getBoundingClientRect().top + window.pageYOffset + headerOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

function getElement(element: OutlineElement, props: OutlineElementProps, inset?: boolean) {
    const classes = useStyles(props);
    return (
        <React.Fragment>
            <ListItem className={inset ? classes.inset : ''}>
                <ListItemIcon classes={{ root: classes.listItem }}>
                    <Box fontSize=".65rem">
                        <RadioButtonUncheckedIcon fontSize="inherit" />
                    </Box>
                </ListItemIcon>
                <ListItemText
                    disableTypography
                    primary={
                        <Link component="button" variant="subtitle1" onClick={() => scrollToId(element.id)}>
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
