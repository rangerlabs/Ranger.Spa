import * as React from 'react';
import { Button, DialogContentText, TextField, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import titleCase = require('title-case');

interface NewProjectApiKeysContentProps {
    environment: string;
    newApiKey: string;
    onClose: () => void;
}

function NewProjectEnvironmentApiKeyContent(newProjectEnvironmentApiKeyContentProps: NewProjectApiKeysContentProps): JSX.Element {
    return (
        <React.Fragment>
            <DialogTitle>API Keys</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    We've re-generated the API Key for your project's {newProjectEnvironmentApiKeyContentProps.environment} environment. Keep this safe. For the
                    security of your application this cannot be recovered once this dialog is closed, even by Ranger.
                </DialogContentText>
                <TextField
                    disabled
                    fullWidth
                    label={`${titleCase(newProjectEnvironmentApiKeyContentProps.environment)} Api Key`}
                    value={newProjectEnvironmentApiKeyContentProps.newApiKey}
                ></TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={newProjectEnvironmentApiKeyContentProps.onClose}>Ok</Button>
            </DialogActions>
        </React.Fragment>
    );
}

export default NewProjectEnvironmentApiKeyContent;
