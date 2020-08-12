import React from 'react';
import { List, ListItem, ListItemText, makeStyles, Theme, createStyles, ListItemIcon } from '@material-ui/core';
import CircleSmall from 'mdi-material-ui/CircleSmall';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
        },
        textRoot: {
            margin: 0,
        },
        iconRoot: {
            minWidth: theme.spacing(4),
            color: theme.palette.text.primary,
        },
    })
);

interface BulletedUnorderedListProps {
    items: string[];
}

export function BulletedUnorderedList(props: BulletedUnorderedListProps) {
    const classes = useStyles(props);
    return (
        <div className={classes.list}>
            <List dense disablePadding>
                {props.items.map((item, index) => {
                    return (
                        <ListItem key={index}>
                            <ListItemIcon classes={{ root: classes.iconRoot }}>
                                <CircleSmall />
                            </ListItemIcon>
                            <ListItemText classes={{ root: classes.textRoot }} primary={item} />
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}
