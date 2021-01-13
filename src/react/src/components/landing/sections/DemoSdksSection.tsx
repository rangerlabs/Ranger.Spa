import * as React from 'react';
import { Theme, createStyles, Grid, Typography, Button, Paper, useTheme, makeStyles, Link } from '@material-ui/core';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import GitHubIcon from '../../../../assets/GitHub.svg';
import IphoneDemoMockup from '../../../../assets/iphone-demo-mockup.png';
import DownloadOnTheAppStore from '../../../../assets/download-on-the-app-store.svg';
import RoutePaths from '../../RoutePaths';
import DocRoutePaths from '../documentation/DocRoutePaths';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		layout: {
			background: theme.palette.primary.main,
			paddingTop: theme.spacing(8),
			paddingBottom: theme.spacing(8),
		},
		white: {
			color: theme.palette.common.white,
		},
		whiteBackground: {
			backgroundColor: theme.palette.common.white,
		},
	})
);

interface HeroProps {
	push: typeof push;
}

const DemoSdksSection = function (props: HeroProps) {
	function handleReadTheSdksClick() {
		props.push(RoutePaths.Docs.replace(':name', DocRoutePaths.Sdks));
	}
	function handleSignUpClick() {
		props.push(RoutePaths.SignUp);
	}

	const classes = useStyles();

	return (
		<div className={classes.layout}>
			<Grid container alignContent="center" justify="center" spacing={5}>
				<Grid item xs={12}>
					<Typography gutterBottom className={classes.white} align="center" variant="h4">
						Open Source, Developer Friendly Demos and SDKs
					</Typography>
					<Typography className={classes.white} align="center" variant="h6">
						Demos and in-app tools help develop and test Geofences and Integrations
					</Typography>
				</Grid>
				<Grid container item md={6} xs={10} alignContent="center" justify="center" spacing={5}>
					<Grid item md={4} sm={6} xs={10}>
						<Grid container direction="column" alignItems="center">
							<Grid item>
								<img width="100%" src={IphoneDemoMockup} alt="iOS Mockup" />
							</Grid>
							<Grid item>
								<Link href="https://apps.apple.com/us/app/ranger-labs-demo/id1548145851" component="button">
									<DownloadOnTheAppStore />
								</Link>
							</Grid>
						</Grid>
					</Grid>
					<Grid item md={6} sm={10} xs={10}>
						<Typography gutterBottom className={classes.white} align="left" variant="subtitle1">
							<Link onClick={handleSignUpClick}>• Sign Up</Link>
						</Typography>
						<Typography gutterBottom className={classes.white} align="left" variant="subtitle1">
							• Create and configure a geofences
						</Typography>
						<Typography gutterBottom className={classes.white} align="left" variant="subtitle1">
							• Download and configure the app
						</Typography>
						<Typography gutterBottom className={classes.white} align="left" variant="subtitle1">
							• Take a walk and see your events
						</Typography>
					</Grid>
				</Grid>
				<Grid container alignContent="center" justify="center" item md={4} xs={10}>
					<Grid item>
						<Typography gutterBottom className={classes.white} variant="h5">
							Open Source API and Tracking SDKs
						</Typography>
						<Typography gutterBottom className={classes.white} variant="subtitle1"></Typography>
						<div className={classes.white}>
							<Grid container alignItems="center" justify="center" spacing={3}>
								<Grid item>
									<Button
										className={classes.whiteBackground}
										color="primary"
										variant="outlined"
										startIcon={<GitHubIcon />}
										href="https://github.com/rangerlabs"
										data-size="large"
									>
										View on GitHub
									</Button>
								</Grid>
								<Grid item>
									<Button className={classes.whiteBackground} color="primary" variant="outlined" onClick={handleReadTheSdksClick}>
										Read the SDK docs
									</Button>
								</Grid>
							</Grid>
						</div>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default connect(null, { push })(DemoSdksSection);
