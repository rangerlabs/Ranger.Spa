import * as React from "react";
import { Theme, createStyles, WithStyles, Chip, withStyles } from "@material-ui/core";
import { Breadcrumbs } from "@material-ui/lab";
import { ChipProps } from "@material-ui/core/Chip";
import Breadcrumb from "../../../models/app/Breadcrumb";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../../../stores";

const styles = (theme: Theme) =>
    createStyles({
        chip: {
            backgroundColor: theme.palette.common.white,
            color: "rgba(102, 66, 163, 1)",
            fontWeight: theme.typography.fontWeightMedium,
            fontSize: theme.typography.subtitle1.fontSize,
            "&:hover, &:focus": {
                backgroundColor: "rgba(102, 66, 163, 0.8)",
                color: theme.palette.common.white,
            },
        },
        avatar: {
            background: "none",
            marginRight: -theme.spacing.unit * 1.5,
        },
    });

interface CustomBreadcrumbProps extends WithStyles<typeof styles> {}

class CustomBreadcrumb extends React.Component<CustomBreadcrumbProps & ChipProps> {
    render() {
        const { classes, ...rest } = this.props;
        return <Chip className={classes.chip} {...rest} />;
    }
}
const StyledBreadcrumb = withStyles(styles)(CustomBreadcrumb);

const mapStateToProps = (state: ApplicationState) => {
    return {
        selectedApp: state.selectedApp,
    };
};
interface CustomizedBreadcrumbsProps extends WithStyles<typeof styles> {
    breadcrumbs: Breadcrumb[];
    push: typeof push;
    selectedApp: string;
}
class CustomizedBreadcrumbs extends React.Component<CustomizedBreadcrumbsProps> {
    handleClick(path: string) {
        let pushPath = path;
        if (this.props.selectedApp) {
            pushPath = path.replace(":appName", this.props.selectedApp);
        }
        this.props.push(pushPath);
    }

    render() {
        return (
            <Breadcrumbs arial-label="Breadcrumb">
                {this.props.breadcrumbs.map((b, i, a) => {
                    return i === a.length - 1 ? (
                        <StyledBreadcrumb key={b.path} label={b.label} />
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
