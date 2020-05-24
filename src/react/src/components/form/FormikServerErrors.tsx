import * as React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { IValidationError } from '../../services/RestUtilities';

interface FormikValidationErrorsProps {
    errors: IValidationError[];
}

export default function FormikValidationErrors(props: FormikValidationErrorsProps) {
    return (
        <List disablePadding>
            <ListItem disableGutters>
                {props.errors.map((error) => (
                    <React.Fragment>
                        <ListItemText primaryTypographyProps={{ color: 'error' }} primary={error.name} />
                        <ListItemText primaryTypographyProps={{ color: 'error' }} primary={error.reason} />
                    </React.Fragment>
                ))}
            </ListItem>
        </List>
    );
}
