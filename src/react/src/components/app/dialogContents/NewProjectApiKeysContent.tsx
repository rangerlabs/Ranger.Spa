import * as React from 'react';
import { Button, DialogContentText, TextField, DialogContent, DialogActions, DialogTitle, Grid, IconButton, Tooltip } from '@material-ui/core';
import CopyToClipboard from 'react-copy-to-clipboard';
import ContentCopy from 'mdi-material-ui/ContentCopy';

interface NewProjectApiKeysContentProps {
    liveApiKey: string;
    testApiKey: string;
    projectApiKey: string;
    onClose: () => void;
}

function NewProjectApiKeysContent(newProjectApiKeysContentProps: NewProjectApiKeysContentProps): JSX.Element {
    return (
        <React.Fragment>
            <DialogTitle>API keys</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    These are the API keys for your project. Keep these safe. For the security of your application these cannot be recovered once this dialog is
                    closed.
                </DialogContentText>
                <Grid container>
                    <Grid item xs={11}>
                        <TextField disabled fullWidth label="Live API key" value={newProjectApiKeysContentProps.liveApiKey}></TextField>
                    </Grid>
                    <Grid item xs={1}>
                        <CopyToClipboard text={newProjectApiKeysContentProps.liveApiKey}>
                            <Tooltip title="Copy API key" placement="bottom">
                                <IconButton aria-label="Copy API key">
                                    <ContentCopy />
                                </IconButton>
                            </Tooltip>
                        </CopyToClipboard>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={11}>
                        <TextField disabled fullWidth label="Test API key" value={newProjectApiKeysContentProps.testApiKey}></TextField>
                    </Grid>
                    <Grid item xs={1}>
                        <CopyToClipboard text={newProjectApiKeysContentProps.testApiKey}>
                            <Tooltip title="Copy API key" placement="bottom">
                                <IconButton aria-label="Copy API key">
                                    <ContentCopy />
                                </IconButton>
                            </Tooltip>
                        </CopyToClipboard>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={11}>
                        <TextField disabled fullWidth label="Project API key" value={newProjectApiKeysContentProps.projectApiKey}></TextField>
                    </Grid>
                    <Grid item xs={1}>
                        <CopyToClipboard text={newProjectApiKeysContentProps.projectApiKey}>
                            <Tooltip title="Copy API key" placement="bottom">
                                <IconButton aria-label="Copy API key">
                                    <ContentCopy />
                                </IconButton>
                            </Tooltip>
                        </CopyToClipboard>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={newProjectApiKeysContentProps.onClose}>Ok</Button>
            </DialogActions>
        </React.Fragment>
    );
}

export default NewProjectApiKeysContent;
