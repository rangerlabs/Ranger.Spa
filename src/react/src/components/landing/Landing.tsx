import * as React from "react";
import { Component } from "react";
import { withStyles, Theme, createStyles, WithStyles, Slide, Typography, Fade } from "@material-ui/core";
import OverviewParallaxGradientLayer from "./sections/OverviewParallaxGradientLayer";
import { ParallaxLayer, Parallax } from "react-spring/renderprops-addons";
import InView from "react-intersection-observer";
import ImageCarousel from "./sections/ImageCarousel";
import OverviewParallaxContentLayer from "./sections/OverviewParallaxContentLayer";

const styles = (theme: Theme) =>
    createStyles({
        overview: {
            // height: "100vh",
            // width: "100vw",
        },
        features: {
            height: "700px",
            backgroundColor: "white",
        },
        pricing: {},
        contact: {},
        menuItemTextColor: {
            color: theme.drawer.text.color,
        },
    });

interface LandingProps extends WithStyles<typeof styles> {}

class Landing extends Component<LandingProps> {
    parallax: React.RefObject<Parallax>;
    constructor(props: LandingProps) {
        super(props);
        this.parallax = React.createRef();
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Parallax pages={2} scrolling={true} ref={this.parallax}>
                    <ParallaxLayer>{/* <ImageCarousel /> */}</ParallaxLayer>
                    <ParallaxLayer speed={1}>
                        <div id="#overview" className={classes.overview}>
                            <OverviewParallaxGradientLayer />
                        </div>
                    </ParallaxLayer>
                    <ParallaxLayer speed={1}>
                        <OverviewParallaxContentLayer />
                        <div id="#features" className={classes.features}>
                            <InView triggerOnce={true} threshold={0.2}>
                                {({ inView, ref }: any) => (
                                    <div ref={ref}>
                                        <Fade in={inView} timeout={2000}>
                                            <Typography variant="h3">Features</Typography>
                                        </Fade>
                                    </div>
                                )}
                            </InView>
                        </div>
                        <div id="#pricing" className={classes.pricing} />
                        <div id="#contact" className={classes.contact} />
                    </ParallaxLayer>
                </Parallax>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Landing);
