import * as React from 'react';
import { Theme, createStyles, WithStyles, Chip, withStyles, Breadcrumbs, Link, Typography } from '@material-ui/core';
import Breadcrumb from '../../../models/app/Breadcrumb';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import ChevronRight from 'mdi-material-ui/ChevronRight';
import IProject from '../../../models/app/IProject';
import Constants from '../../../theme/Constants';

const styles = (theme: Theme) =>
    createStyles({
        textColor: {
            color: theme.palette.common.white,
        },
    });

interface CustomBreadcrumbProps extends WithStyles<typeof styles> {
    label: string;
    onClick?: () => void;
}

class CustomBreadcrumb extends React.Component<CustomBreadcrumbProps> {
    render() {
        const { classes, label, ...rest } = this.props;
        return (
            <Link classes={{ button: classes.textColor }} key={label} component="button" variant="subtitle1" {...rest}>
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
        if (this.props.selectedProject.name) {
            pushPath = path.replace(':appName', this.props.selectedProject.name);
        }
        this.props.push(pushPath);
    }

    render() {
        const { classes } = this.props;
        return (
            <Breadcrumbs
                classes={{ li: classes.textColor }}
                separator={<ChevronRight fontSize="small" htmlColor={Constants.COLORS.WHITE} />}
                arial-label="Breadcrumb"
            >
                {this.props.breadcrumbs.map((b, i, a) => {
                    return i === a.length - 1 ? (
                        <Typography variant="subtitle1" key={b.path}>
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

export default connect(mapStateToProps, { push })(withStyles(styles)(CustomizedBreadcrumbs));
