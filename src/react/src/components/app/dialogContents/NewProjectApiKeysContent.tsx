import * as React from 'react';
import { Button, DialogContentText, TextField, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';

interface NewProjectApiKeysContentProps {
    liveApiKey: string;
    testApiKey: string;
    onClose: () => void;
}

function NewProjectApiKeysContent(newProjectApiKeysContentProps: NewProjectApiKeysContentProps): JSX.Element {
    return (
        <React.Fragment>
            <DialogTitle>API Keys</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    We've generated the API Keys for your project. Keep these safe. For the security of your application these cannot be recovered once this
                    dialog is closed, even by Ranger.
                </DialogContentText>
                <TextField disabled fullWidth label="Live Api Key" value={newProjectApiKeysContentProps.liveApiKey}></TextField>
                <TextField disabled fullWidth label="Test Api Key" value={newProjectApiKeysContentProps.testApiKey}></TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={newProjectApiKeysContentProps.onClose}>Ok</Button>
            </DialogActions>
        </React.Fragment>
    );
}

export default NewProjectApiKeysContent;
