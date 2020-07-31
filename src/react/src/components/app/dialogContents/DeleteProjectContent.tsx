import * as React from 'react';
import { DialogActions, Button, DialogContentText, List, ListItem, ListItemText, DialogTitle, DialogContent, Typography } from '@material-ui/core';
import { useState } from 'react';
import FormikTextField from '../../form/FormikTextField';
import { Formik, FormikBag, FormikProps } from 'formik';
import * as Yup from 'yup';
import FormikPrimaryButton from '../../form/FormikPrimaryButton';
import IProject from '../../../models/app/IProject';
import ProjectService from '../../../services/ProjectService';
import { IRestResponse } from '../../../services/RestUtilities';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import { connect } from 'react-redux';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { removeProject } from '../../../redux/actions/ProjectActions';
import { closeDialog } from '../../../redux/actions/DialogActions';

const projectService = new ProjectService();

interface DeleteProjectContentProps extends WithSnackbarProps {
    id: string;
    name: string;
    push: typeof push;
    closeDialog: () => void;
    dispatchRemoveProject: (name: string) => void;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        dispatchRemoveProject: (id: string) => {
            const action = removeProject(id);
            dispatch(action);
        },
        closeDialog: () => {
            const action = closeDialog();
            dispatch(action);
        },
    };
};

function DeleteProjectContent(deleteProjectContentProps: DeleteProjectContentProps): JSX.Element {
    const [serverError, setServerError] = useState(undefined as string);

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .matches(new RegExp(`^${deleteProjectContentProps.name}$`), `The name entered is incorrect.`)
            .required('Required'),
    });

    return (
        <React.Fragment>
            <Formik
                initialValues={{ name: '' }}
                onSubmit={(values: Partial<IProject>, formikBag: FormikBag<FormikProps<Partial<IProject>>, Partial<IProject>>) => {
                    setServerError(undefined);
                    projectService.deleteProject(deleteProjectContentProps.id).then((response: IRestResponse<void>) => {
                        if (response.isError) {
                            deleteProjectContentProps.enqueueSnackbar(response.error.message, { variant: 'error' });
                        } else {
                            deleteProjectContentProps.closeDialog();
                            deleteProjectContentProps.dispatchRemoveProject(deleteProjectContentProps.id);
                            deleteProjectContentProps.enqueueSnackbar(response.message, { variant: 'success' });
                            deleteProjectContentProps.push(RoutePaths.Projects);
                        }
                    });
                }}
                validateOnMount={false}
                isInitialValid={false}
                validationSchema={validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <DialogTitle>Delete project?</DialogTitle>
                        <form onSubmit={props.handleSubmit}>
                            <DialogContent>
                                <DialogContentText color="error">To delete this project please confirm the project's name.</DialogContentText>
                                <DialogContentText color="error">{deleteProjectContentProps.name}</DialogContentText>
                                <FormikTextField
                                    name="name"
                                    label="Project Name"
                                    value={props.values.name}
                                    errorText={props.errors.name}
                                    touched={props.touched.name}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    autoComplete="off"
                                    required
                                />
                                {serverError && <Typography color="error">{serverError}</Typography>}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={deleteProjectContentProps.closeDialog} color="primary" variant="text">
                                    Cancel
                                </Button>
                                <FormikPrimaryButton denseMargin isValid={props.isValid} isSubmitting={props.isSubmitting} variant="text">
                                    Delete project
                                </FormikPrimaryButton>
                            </DialogActions>
                        </form>
                    </React.Fragment>
                )}
            </Formik>
        </React.Fragment>
    );
}

export default connect(null, mapDispatchToProps)(withSnackbar(DeleteProjectContent));
