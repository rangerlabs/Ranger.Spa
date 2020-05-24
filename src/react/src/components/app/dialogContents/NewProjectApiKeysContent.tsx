import * as React from 'react';
import { Button, DialogContentText, TextField, DialogContent, DialogActions, DialogTitle, Grid, IconButton, Tooltip } from '@material-ui/core';
import CopyToClipboard from 'react-copy-to-clipboard';
import ContentCopy from 'mdi-material-ui/ContentCopy';

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
                <Grid container>
                    <Grid item xs={11}>
                        <TextField disabled fullWidth label="Live API Key" value={newProjectApiKeysContentProps.liveApiKey}></TextField>
                    </Grid>
                    <Grid item xs={1}>
                        <CopyToClipboard text={newProjectApiKeysContentProps.liveApiKey}>
                            <Tooltip title="Copy API Key" placement="bottom">
                                <IconButton aria-label="Copy API Key">
                                    <ContentCopy />
                                </IconButton>
                            </Tooltip>
                        </CopyToClipboard>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={11}>
                        <TextField disabled fullWidth label="Test API Key" value={newProjectApiKeysContentProps.testApiKey}></TextField>
                    </Grid>
                    <Grid item xs={1}>
                        <CopyToClipboard text={newProjectApiKeysContentProps.testApiKey}>
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
                <Button onClick={newProjectApiKeysContentProps.onClose}>Ok</Button>
            </DialogActions>
        </React.Fragment>
    );
}

export default NewProjectApiKeysContent;
