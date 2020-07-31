import * as React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { IError } from '../../services/RestUtilities';

interface FormikValidationErrorsProps {
    error: IError;
}

export default function FormikValidationErrors(props: FormikValidationErrorsProps) {
    return (
        <List disablePadding>
            <ListItem disableGutters>
                {Object.keys(props.error.formikErrors).map((key) => (
                    <React.Fragment>
                        <ListItemText primaryTypographyProps={{ color: 'error' }} primary={key} />
                        <ListItemText primaryTypographyProps={{ color: 'error' }} primary={props.error.formikErrors.get(key)} />
                    </React.Fragment>
                ))}
            </ListItem>
        </List>
    );
}
