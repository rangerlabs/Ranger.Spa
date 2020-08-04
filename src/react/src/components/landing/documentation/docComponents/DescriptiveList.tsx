import { PropsWithChildren } from 'react';
import { Theme, createStyles, makeStyles, List, ListItem, ListItemText } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            padding: theme.spacing(4),
        },
    })
);

interface DescriptiveListProps {
    descriptions: Description[];
}

export interface Description {
    title: string;
    description: string;
}

export default function DescriptiveList(props: PropsWithChildren<DescriptiveListProps>) {
    const classes = useStyles(props);
    return (
        <List className={classes.list}>
            {props.descriptions.map((d, i) => (
                <ListItem key={i}>
                    <ListItemText primary={d.title} secondary={d.description} />
                </ListItem>
            ))}
        </List>
    );
}
