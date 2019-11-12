import * as React from 'react';
import { Component } from 'react';
import { withStyles, Theme, createStyles, WithStyles, Typography, Fade } from '@material-ui/core';
import { ParallaxLayer, Parallax } from 'react-spring/renderprops-addons';
import InView from 'react-intersection-observer';
import Observer from 'react-intersection-observer';
import OverviewParallaxContentLayer from './sections/OverviewParallaxContentLayer';
import ScrollTop from './ScrollTop';
import { enqueueSnackbar, SnackbarNotification } from '../../redux/actions/SnackbarActions';
import { connect } from 'react-redux';

const styles = (theme: Theme) =>
    createStyles({
        parallaxContainer: {
            position: 'absolute',
            top: theme.toolbar.height,
            height: `calc(100% - ${theme.toolbar.height}px)`,
            width: '100%',
        },
        scrollToTopContainer: {
            height: '100%',
        },
        features: {
            height: '700px',
            backgroundColor: 'white',
        },
        pricing: {},
        contact: {},
        menuItemTextColor: {
            color: theme.drawer.text.color,
        },
    });

interface LandingProps extends WithStyles<typeof styles> {
    parallaxRef: (ref: Parallax) => void;
    enqueueSnackbar: typeof enqueueSnackbar;
}

interface LandingState {
    atPageTop: boolean;
}

class Landing extends Component<LandingProps, LandingState> {
    parallax: Parallax;

    constructor(props: LandingProps) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.enqueueSnackbar({
                message: 'Welcome to Ranger! We are still actively under development and all data is subject to deletion. Check back soon for more info.',
                options: { variant: 'success', persist: true },
            } as SnackbarNotification);
        }, 350);
    }

    state = {
        atPageTop: true,
    };

    handleIntersectionChange = (inView: boolean) => {
        this.setState({ atPageTop: inView });
    };

    setRef = (ref: Parallax) => {
        this.parallax = ref;
        this.props.parallaxRef ? this.props.parallaxRef(ref) : undefined;
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.parallaxContainer}>
                <Parallax pages={1} scrolling={true} ref={this.setRef}>
                    <ParallaxLayer speed={1}>
                        <Observer onChange={this.handleIntersectionChange}>
                            <div />
                        </Observer>
                        <OverviewParallaxContentLayer />
                        {/* <div id="#features" className={classes.features}>
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
                        <div id="#contact" className={classes.contact} /> */}
                    </ParallaxLayer>
                </Parallax>
                <ScrollTop
                    visible={!this.state.atPageTop}
                    onClick={() => {
                        this.parallax.scrollTo(0);
                    }}
                />
            </div>
        );
    }
}

export default connect(
    null,
    { enqueueSnackbar }
)(withStyles(styles)(Landing));
