import * as React from 'react';
import { Component } from 'react';
import { withStyles, Theme, createStyles, WithStyles } from '@material-ui/core';
import Observer from 'react-intersection-observer';
import Hero from './sections/Hero';
import ScrollTop from './ScrollTop';
import { enqueueSnackbar } from '../../redux/actions/SnackbarActions';
import { connect } from 'react-redux';
import Footer from './footer/Footer';
import NewsletterSection from './sections/NewsletterSection';
import { scrollToLandingId } from '../../helpers/Helpers';
import GetStartedForFree from './getStartedForFree/GetStartedForFree';
import FeaturesSection from './sections/FeaturesSection';
import DemoSdksSection from './sections/DemoSdksSection';
import UseCaseSection from './sections/UseCaseSection';

const styles = (theme: Theme) =>
    createStyles({
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
    enqueueSnackbar: typeof enqueueSnackbar;
}

interface LandingState {
    atPageTop: boolean;
}

class Landing extends Component<LandingProps, LandingState> {
    constructor(props: LandingProps) {
        super(props);
    }

    state = {
        atPageTop: true,
    };

    handleIntersectionChange = (inView: boolean) => {
        this.setState({ atPageTop: inView });
    };

    // componentDidMount() {
    //     ReactDOM.createPortal(<NewsletterSection />, document.getElementById('newsletter-section'));
    // }
    render() {
        return (
            <React.Fragment>
                <Observer onChange={this.handleIntersectionChange}>
                    <div />
                </Observer>
                <Hero scrollToId="next" />
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
                {/* <div id="newsletter-section" /> */}
                <div id="next" />
                <UseCaseSection />
                <DemoSdksSection />
                <FeaturesSection />
                <NewsletterSection />
                <GetStartedForFree />
                <Footer />
                <ScrollTop
                    visible={!this.state.atPageTop}
                    onClick={() => {
                        scrollToLandingId('toolbar-push');
                    }}
                />
            </React.Fragment>
        );
    }
}

export default connect(null, { enqueueSnackbar })(withStyles(styles)(Landing));
