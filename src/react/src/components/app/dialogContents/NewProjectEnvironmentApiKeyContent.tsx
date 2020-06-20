import * as React from 'react';
import { Button, DialogContentText, TextField, DialogContent, DialogActions, DialogTitle, Grid, Tooltip, IconButton } from '@material-ui/core';
import ContentCopy from 'mdi-material-ui/ContentCopy';
import CopyToClipboard from 'react-copy-to-clipboard';
import { capitalCase } from 'change-case';

interface NewProjectApiKeysContentProps {
    environmentName: string;
    newApiKey: string;
    onClose: () => void;
}

function NewProjectEnvironmentApiKeyContent(newProjectEnvironmentApiKeyContentProps: NewProjectApiKeysContentProps): JSX.Element {
    return (
        <React.Fragment>
            <DialogTitle>API Keys</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This is the API Key for your project's {newProjectEnvironmentApiKeyContentProps.environmentName} environment. Keep this safe. For the
                    security of your application this cannot be recovered once this dialog is closed.
                </DialogContentText>
                <Grid container>
                    <Grid item xs={11}>
                        <TextField
                            disabled
                            fullWidth
                            label={`${capitalCase(newProjectEnvironmentApiKeyContentProps.environmentName)} API Key`}
                            value={newProjectEnvironmentApiKeyContentProps.newApiKey}
                        ></TextField>
                    </Grid>
                    <Grid item xs={1}>
                        <CopyToClipboard text={newProjectEnvironmentApiKeyContentProps.newApiKey}>
                            <Tooltip title="Copy API Key" placement="bottom">
                                <IconButton aria-label="Copy API Key">
                                    <ContentCopy />
                                </IconButton>
                            </Tooltip>
                        </CopyToClipboard>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={newProjectEnvironmentApiKeyContentProps.onClose}>Ok</Button>
            </DialogActions>
        </React.Fragment>
    );
}

export default NewProjectEnvironmentApiKeyContent;
