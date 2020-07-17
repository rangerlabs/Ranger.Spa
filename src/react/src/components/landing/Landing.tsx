import * as React from 'react';
import { Component } from 'react';
import { withStyles, Theme, createStyles, WithStyles } from '@material-ui/core';
import InView from 'react-intersection-observer';
import Observer from 'react-intersection-observer';
import Hero from './sections/Hero';
import ScrollTop from './ScrollTop';
import { enqueueSnackbar } from '../../redux/actions/SnackbarActions';
import { connect } from 'react-redux';
import Footer from './footer/Footer';
import NewsletterSection from './sections/NewsletterSection';
import ReactDOM from 'react-dom';

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

    componentDidMount() {
        ReactDOM.render(<NewsletterSection />, document.getElementById('newsletter-section'));
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <Observer onChange={this.handleIntersectionChange}>
                    <div />
                </Observer>
                <Hero />
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
                <div id="newsletter-section" />
                <Footer />
                <ScrollTop
                    visible={!this.state.atPageTop}
                    onClick={() => {
                        document.getElementById('toolbar-push').scrollIntoView({ behavior: 'smooth' });
                    }}
                />
            </React.Fragment>
        );
    }
}

export default connect(null, { enqueueSnackbar })(withStyles(styles)(Landing));
