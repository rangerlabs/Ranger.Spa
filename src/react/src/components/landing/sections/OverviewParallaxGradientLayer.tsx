import * as React from "react";
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/styles";

const styles = (theme: Theme) =>
    createStyles({
        appBarPush: {
            height: theme.toolbar.height,
            width: "100%",
        },
        imagesContainer: {
            // backgroundImage: "linear-gradient(-45deg, #b230ae 0%, #e94057 30%, #f27121 80%)",
            backgroundImage: "linear-gradient(-45deg, rgba(204,153,204,1) 0%,rgba(126,87,194,1) 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            height: "100%",
            width: "100%",
            opacity: 0.5,
        },
    });

interface OverviewProps extends WithStyles<typeof styles> {}

class OverviewParallaxGradientLayer extends React.Component<OverviewProps> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.imagesContainer}>
                <div className={classes.appBarPush} />
            </div>
        );
    }
}

export default withStyles(styles)(OverviewParallaxGradientLayer);
