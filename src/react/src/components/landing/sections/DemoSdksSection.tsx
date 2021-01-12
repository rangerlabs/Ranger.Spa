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
		typography: {
			[theme.breakpoints.up('md')]: {
				textAlign: 'left',
			},
			textAlign: 'center',
			color: theme.palette.common.black,
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
	const theme = useTheme();

	return (
		<div className={classes.layout}>
			<Grid container alignContent="center" justify="center" spacing={5}>
				<Grid item md={6} xs={10}>
					<img width="100%" src={IphoneDemoMockup} alt="Create Geofence" />
					<Link component="button">
						<DownloadOnTheAppStore />
					</Link>
				</Grid>
				<Grid container alignContent="center" justify="center" item>
					<Grid item md={4} xs={10}>
						<Typography gutterBottom className={classes.typography} variant="h5">
							Open Source SDKs available
						</Typography>
						<Typography gutterBottom className={classes.typography} variant="subtitle1"></Typography>
						<div className={classes.typography}>
							<Grid container>
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
