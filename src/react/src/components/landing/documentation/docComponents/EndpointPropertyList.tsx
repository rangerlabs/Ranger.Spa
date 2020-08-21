import { PropsWithChildren } from 'react';
import { Theme, createStyles, makeStyles, List, ListItem, ListItemText } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            padding: 0,
        },
        listIteam: {
            padding: 0,
        },
    })
);

interface EndpointPropertyListProps {
    properties: EndpointProperty[];
}

export interface EndpointProperty {
    title: string;
    description: React.ReactNode;
}

export default function EndpointPropertiesList(props: PropsWithChildren<EndpointPropertyListProps>) {
    const classes = useStyles(props);
    return (
        <List className={classes.list}>
            {props.properties.map((d, i) => (
                <ListItem key={i} className={classes.listIteam}>
                    <ListItemText primary={d.title} secondary={d.description} />
                </ListItem>
            ))}
        </List>
    );
}
