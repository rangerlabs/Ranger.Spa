import * as React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import Exclamation from 'mdi-material-ui/Exclamation';

interface IFormikServerErrorsProps {
    errors: string[];
}

export default function FormikServerErrors(props: IFormikServerErrorsProps) {
    return (
        <List disablePadding>
            <ListItem disableGutters>
                {props.errors.map(error => (
                    <React.Fragment>
                        <Exclamation color="error" />
                        <ListItemText primaryTypographyProps={{ color: 'error' }} primary={error} />
                    </React.Fragment>
                ))}
            </ListItem>
        </List>
    );
}
