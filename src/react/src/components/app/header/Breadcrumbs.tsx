import * as React from 'react';
import { Theme, createStyles, WithStyles, Chip, withStyles, Breadcrumbs, Link, Typography } from '@material-ui/core';
import Breadcrumb from '../../../models/app/Breadcrumb';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import ChevronRight from 'mdi-material-ui/ChevronRight';
import IProject from '../../../models/app/IProject';

const styles = (theme: Theme) => createStyles({});

interface CustomBreadcrumbProps extends WithStyles<typeof styles> {
    label: string;
    onClick?: () => void;
}

class CustomBreadcrumb extends React.Component<CustomBreadcrumbProps> {
    render() {
        const { classes, label, ...rest } = this.props;
        return (
            <Link key={label} component="button" variant="subtitle1" color="inherit" {...rest}>
                {label}
            </Link>
        );
    }
}
const StyledBreadcrumb = withStyles(styles)(CustomBreadcrumb);

const mapStateToProps = (state: ApplicationState) => {
    return {
        selectedProject: state.selectedProject,
    };
};
interface CustomizedBreadcrumbsProps extends WithStyles<typeof styles> {
    breadcrumbs: Breadcrumb[];
    push: typeof push;
    selectedProject: IProject;
}
class CustomizedBreadcrumbs extends React.Component<CustomizedBreadcrumbsProps> {
    handleClick(path: string) {
        let pushPath = path;
        if (this.props.selectedProject) {
            pushPath = path.replace(':appName', this.props.selectedProject.name);
        }
        this.props.push(pushPath);
    }

    render() {
        return (
            <Breadcrumbs separator={<ChevronRight fontSize="small" />} arial-label="Breadcrumb">
                {this.props.breadcrumbs.map((b, i, a) => {
                    return i === a.length - 1 ? (
                        <Typography key={b.path} color="textPrimary">
                            {b.label}
                        </Typography>
                    ) : (
                        <StyledBreadcrumb
                            key={b.path}
                            label={b.label}
                            onClick={() => {
                                this.handleClick(b.path);
                            }}
                        />
                    );
                })}
            </Breadcrumbs>
        );
    }
}

export default connect(
    mapStateToProps,
    { push }
)(withStyles(styles)(CustomizedBreadcrumbs));
