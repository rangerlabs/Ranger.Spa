import * as React from 'react';
import { Grid, Link } from '@material-ui/core';
import PlanCard from './PlanCard';
import { Plans } from '../../../helpers/Helpers';

export default function PlanCards() {
    return (
        <React.Fragment>
            {/* <Grid item xs={11} sm={8} md={5} lg={3}>
                <PlanCard
                    planName="Sandbox"
                    message="Get a feel and test your integrations"
                    limitDetails={Plans.filter((p) => p.name === 'Sandbox')[0].limitDetails}
                    cost="FREE"
                />
            </Grid>
            <Grid item xs={11} sm={8} md={5} lg={3}>
                <PlanCard
                    planName="Startup"
                    message="When you're ready to grow"
                    limitDetails={Plans.filter((p) => p.name === 'Startup')[0].limitDetails}
                    cost="$49 / Month"
                />
            </Grid>
            <Grid item xs={11} sm={8} md={5} lg={3}>
                <PlanCard
                    planName="Pro"
                    message="Extend your reach with 5000 geofences"
                    limitDetails={Plans.filter((p) => p.name === 'Pro')[0].limitDetails}
                    cost="$149 / Month"
                />
            </Grid> */}
            <Grid item xs={11} sm={9} md={8}>
                <PlanCard
                    planName="Pilot"
                    message={
                        <React.Fragment>
                            Want to join Ranger's pilot customers? Contact us at <Link href="mailto:info@rangerlabs.io">info@rangerlabs.io</Link>
                        </React.Fragment>
                    }
                    limitDetails={Plans.filter((p) => p.name === 'Enterprise')[0].limitDetails}
                    cost="$--.-- / Month"
                />
            </Grid>
        </React.Fragment>
    );
}
