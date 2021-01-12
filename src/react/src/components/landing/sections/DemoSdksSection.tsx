import * as React from 'react';
import { Theme, createStyles, Grid, Typography, Button, Paper, useTheme, makeStyles, Link } from '@material-ui/core';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import IphoneDemoMockup from '../../../../assets/iphone-demo-mockup.png';
import DownloadOnTheAppStore from '../../../../assets/download-on-the-app-store.svg';
import RoutePaths from '../../RoutePaths';
import GitHubButton from 'react-github-btn';
import DocRoutePaths from '../documentation/DocRoutePaths';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		layout: {
			background: 'linear-gradient(0deg, rgba(250,250,250,1) 0%, rgba(71,145,49) 90%)',
			paddingTop: theme.spacing(8),
			paddingBottom: theme.spacing(8),
		},
		white: {
			color: theme.palette.common.white,
		},
		heroButton: {
			minWidth: '175px',
			marginTop: theme.spacing(1),
			marginLeft: theme.spacing(1.5),
			marginRight: theme.spacing(1.5),
			[theme.breakpoints.up('md')]: {
				marginTop: theme.spacing(3),
				marginRight: theme.spacing(3),
				marginLeft: 0,
			},
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

	const classes = useStyles();

	return (
		<div className={classes.layout}>
			<Grid container alignContent="center" justify="center" spacing={5}>
				<Grid item xs={12}>
					<Typography gutterBottom className={classes.white} align="center" variant="h4">
						Open Source, Developer Friendly Demos and SDKs
					</Typography>
					<Typography className={classes.white} align="center" variant="h6">
						Demos and in-app Tools help develop and test Geofences and Integrations
					</Typography>
				</Grid>
				<Grid container item md={6} xs={10} alignContent="center" justify="center" spacing={5}>
					<Grid item md={4} xs={10} alignContent="center">
						<img width="100%" src={IphoneDemoMockup} alt="iOS Mockup" />
						<Link component="button">
							<DownloadOnTheAppStore />
						</Link>
					</Grid>
					<Grid item md={3} xs={10}>
						<Typography gutterBottom className={classes.white} align="left" variant="subtitle1">
							Step 1) Sign Up
						</Typography>
						<Typography gutterBottom className={classes.white} align="left" variant="subtitle1">
							Step 2) Create and configure a local geofence
						</Typography>
						<Typography gutterBottom className={classes.white} align="left" variant="subtitle1">
							Step 3) Download and configure the app
						</Typography>
						<Typography gutterBottom className={classes.white} align="left" variant="subtitle1">
							Step 4) Take a walk and see your events
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
							<Grid container alignItems="center" justify="center">
								<Grid item xs={5}>
									<GitHubButton href="https://github.com/rangerlabs" data-size="large" aria-label="View on GitHub">
										View on GitHub
									</GitHubButton>
								</Grid>
								<Grid item xs={5}>
									<Button color="primary" variant="contained" className={classes.heroButton} onClick={handleReadTheSdksClick}>
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
