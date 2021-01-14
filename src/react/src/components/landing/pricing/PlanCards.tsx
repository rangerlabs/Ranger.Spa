import * as React from 'react';
import { Grid, Link } from '@material-ui/core';
import PlanCard from './PlanCard';
import { Plans } from '../../../helpers/Helpers';

export default function PlanCards() {
    return (
        <React.Fragment>
            <Grid item xs={11} sm={8} md={5} lg={3}>
                <PlanCard
                    planName="Sandbox"
                    message="Perfect for getting a feel and testing integrations"
                    limitDetails={Plans.filter((p) => p.name === 'Sandbox')[0].limitDetails}
                    cost="FREE"
                />
            </Grid>
            <Grid item xs={11} sm={8} md={5} lg={3}>
                <PlanCard
                    planName="Startup"
                    message="When you're ready to start growing"
                    limitDetails={Plans.filter((p) => p.name === 'Startup')[0].limitDetails}
                    cost="$49 / Month"
                />
            </Grid>
            <Grid item xs={11} sm={8} md={5} lg={3}>
                <PlanCard
                    planName="Pro"
                    message="Extend your reach with 5,000 geofences"
                    limitDetails={Plans.filter((p) => p.name === 'Pro')[0].limitDetails}
                    cost="$149 / Month"
                />
            </Grid>
            <Grid item xs={11} sm={8} md={5} lg={3}>
                <PlanCard
                    planName="Enterprise"
                    message={
                        <React.Fragment>
                            "Contact us" <Link href="mailto:info@rangerlabs.io">info@rangerlabs.io</Link>
                        </React.Fragment>
                    }
                    limitDetails={Plans.filter((p) => p.name === 'Enterprise')[0].limitDetails}
                    cost="$--- / Month"
                />
            </Grid>
        </React.Fragment>
    );
}
