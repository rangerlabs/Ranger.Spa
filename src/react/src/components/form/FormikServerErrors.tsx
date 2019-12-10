import * as React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';

interface IFormikServerErrorsProps {
    errors: string[];
}

export default function FormikServerErrors(props: IFormikServerErrorsProps) {
    return (
        <List disablePadding>
            <ListItem disableGutters>
                {props.errors.map(error => (
                    <React.Fragment>
                        <ListItemText primaryTypographyProps={{ color: 'error' }} primary={error} />
                    </React.Fragment>
                ))}
            </ListItem>
        </List>
    );
}
