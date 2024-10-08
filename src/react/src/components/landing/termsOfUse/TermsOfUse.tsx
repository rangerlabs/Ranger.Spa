import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography, Paper, Link } from '@material-ui/core';
import Footer from '../footer/Footer';
import GetStartedForFree from '../getStartedForFree/GetStartedForFree';
import Section from '../documentation/docComponents/Section';
import Introduction from '../documentation/docComponents/Introduction';
import Paragraph from '../documentation/docComponents/Paragraph';
import RoutePaths from '../../RoutePaths';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import Bold from '../documentation/textEnhancers/Bold';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        push: {
            paddingTop: '3%',
        },
    })
);

interface TermsOfUseProps {
    push: typeof push;
}

function TermsOfUse(props: TermsOfUseProps) {
    const classes = useStyles(props);
    const push = props.push;

    return (
        <React.Fragment>
            <Grid className={classes.push} container direction="column" alignItems="center" spacing={5}>
                <Grid container item justify="center">
                    <Grid item xs={12}>
                        <Typography align="center" variant="h4">
                            Terms of Use
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={11} md={6}>
                    <Introduction id="Introduction" text="">
                        <Paragraph>
                            These Terms of Use (the <Bold>"Terms"</Bold>) set out the terms under which Ranger Labs, LLC (<Bold>"Ranger"</Bold>) agrees to
                            license its proprietary SDK to the person or entity reading and agreeing to these Terms (the <Bold>"Licensee"</Bold> or{' '}
                            <Bold>"you"</Bold>). Licensee signifies its agreement to these Terms by clicking through the acceptance mechanism provided by
                            Ranger, or by using the Services (as defined below) in any way. Please review these terms carefully, because they form a binding
                            contract between you and Ranger. You represent and warrant that you are of legal age to form a binding contract. If you're agreeing
                            to these Terms on behalf of an organization or entity, you represent and warrant that you are authorized to agree to these Terms on
                            that organization or entity's behalf and bind them to these Terms (in which case, the references to "you", "your", and "Licensee" in
                            these Terms, except for in this sentence, refer to that organization or entity).
                        </Paragraph>
                        <Paragraph>
                            To the extent that we are a Processor of Personal Data that is subject to certain Data Protection Laws (as defined in the DPA), the
                            EU Data Processing Addendum (<Bold>"DPA"</Bold>) located at{' '}
                            <Link variant="body1" component="button" onClick={() => push(RoutePaths.DataProcessingAddendum)}>
                                https://rangerlabs.io/dpa
                            </Link>{' '}
                            is hereby incorporated into the Agreement.
                        </Paragraph>
                    </Introduction>
                    <Section id="license" text="1. License to the Services">
                        <Paragraph>
                            Subject to Licensee's compliance with these Terms, including without limitation the restrictions in Section 2, Ranger grants
                            Licensee a limited, worldwide, revocable, non-transferable, non-sublicensable, non-exclusive license to use Ranger's software
                            development kit (<Bold>"SDK"</Bold>) and Ranger's other APIs and web services made generally available by Ranger through the Website
                            without charge (collectively, the SDK and such other APIs and web services are referred to as the <Bold>"Services"</Bold>) within
                            Licensee's applications and websites (collectively the <Bold>"Licensee Properties"</Bold>) solely for Licensee's internal business
                            use in order to collect, analyze, and act on location data collected and generated by the Licensee Properties and/or the Services.
                        </Paragraph>
                    </Section>
                    <Section id="restrictions" text="2. Restrictions on Licensee's Use of the Services">
                        <Paragraph>Licensee agrees that the license set forth in Section 1 is subject to the following conditions:</Paragraph>
                        <Paragraph>
                            a. Absent express written consent from Ranger, Licensee will not use the Services in connection with any Licensee Properties that
                            constitute or promote illegal gambling, adult media (i.e., pornography), pirated content, tobacco products (including without
                            limitation e-cigarettes), firearms or ammunition, or any other product that is illegal in the jurisdiction in or into which it is
                            sold or promoted;
                        </Paragraph>
                        <Paragraph>
                            b. Licensee acknowledges and agrees that the Services enable Licensee to collect SDK Information (as defined in Ranger's{' '}
                            <Link variant="body1" component="button" onClick={() => push(RoutePaths.Privacy)}>
                                privacy policy
                            </Link>
                            ) from end users of the Licensee Properties (<Bold>"End Users"</Bold>). Licensee represents and warrants that it shall use the
                            Services in Licensee Properties only where there is a clear benefit to End Users;
                        </Paragraph>
                        <Paragraph>
                            c. Licensee will only use the Services in connection with Licensee Properties that it owns and operates, and shall not sell,
                            transfer, license, sublicense, give, rent, loan, lease, or otherwise make the Services or their components available to any third
                            party without Ranger's prior express written consent;
                        </Paragraph>
                        <Paragraph>
                            d. Licensee shall not (i) use the Services to develop or test other geofencing, geocoding, autocomplete, or place search APIs; (ii)
                            use Ranger's geocoding, autocomplete, or place search APIs to develop a database of addresses or points of interest; or (iii)
                            pre-fetch, cache, index, or store any address or point of interest data from Ranger's geocoding, autocomplete, or place search APIs
                            for more than 30 days;
                        </Paragraph>
                        <Paragraph>
                            e. Licensee shall not (i) alter, hide, obscure, or remove any copyright, trademark, or other intellectual property rights notice
                            contained in the Services; (ii) reverse engineer, decompile, disassemble, or otherwise translate or derive the source code for the
                            Services, or attempt to do so; (iii) use the Services to create any software or service containing any malicious or harmful code;
                            (iv) use the Services to damage, detrimentally interfere with, surreptitiously intercept, or misappropriate any system or data; (v)
                            use the Services in violation of any applicable law or regulation; or (vi) use the Services in any manner that is harmful,
                            fraudulent, deceptive, threatening, harassing, defamatory, or otherwise objectionable;
                        </Paragraph>
                        <Paragraph>
                            f. Licensee acknowledges and agrees that Ranger may change the form, features, components, or nature of the Services at any time in
                            Ranger's sole discretion without advance notice to Licensee, and that future versions of the Services may no longer be compatible
                            with any given Licensee Property. Licensee acknowledges and agrees that Ranger may stop (permanently or temporarily) providing the
                            Services (or any features within the Services) to Licensee at any time in Ranger's sole discretion without prior notice or any
                            compensation to Licensee.
                        </Paragraph>
                        <Paragraph>
                            g. Nothing in these Terms permit Licensee to use any of Ranger's trade names, trademarks, service marks, logos, domain names, or
                            other distinctive brand features without Ranger's prior express written consent.
                        </Paragraph>
                        <Paragraph>
                            Any violation of any of the foregoing is grounds for immediate termination of Licensee's license and right to use the Services.
                        </Paragraph>
                    </Section>
                    <Section id="termination" text="3. Term and Termination">
                        <Paragraph>
                            These Terms shall commence upon the earlier of Licensee's acceptance of these Terms or Licensee's use of the Services, and shall
                            remain in effect until terminated as provided herein. Either party may terminate these Terms for any reason or for no reason at any
                            time upon five (5) days' prior written notice to the other party. Notwithstanding the foregoing, Ranger may terminate these Terms
                            immediately upon notice to Licensee in the event that Ranger believes Licensee has breached any term of these Terms. Upon
                            termination of these Terms, all licenses granted to Licensee hereunder shall immediately terminate and Licensee shall immediately
                            cease all use of the Services. Licensee understands, however, that the Services may continue to collect data through the Licensee
                            Properties on which the Services are already integrated, and that such data collection (and Ranger's use of such data as permitted
                            herein), may continue until the applicable End Users have: (a) removed or disabled the Services (or any Licensee Property that
                            integrates the Services) or any Licensee Property that integrates the Services from their respective devices; or (b) limited such
                            data collection through applicable device settings in a manner that is communicated to Ranger.
                        </Paragraph>
                    </Section>
                    <Section id="coppa" text="4. Compliance with COPPA">
                        <Paragraph>
                            The Children's Online Privacy Protection Act (<Bold>"COPPA"</Bold>) requires that online service providers obtain parental consent
                            before they knowingly collect personally identifiable information online from children who are under 13. Ranger does not knowingly
                            collect or solicit personally identifiable information from children under 13. Licensee shall not use the Services in conjunction
                            with a Licensee Property that is directed to children under the age of 13. Licensee shall not use the Services to knowingly send to
                            Ranger any personal information (including without limitation device identifiers, IP addresses, or precise location data) that has
                            been collected from children under the age of 13. If Ranger learns it has collected personal information from a child under 13,
                            Ranger will delete that information as quickly as possible. If you believe that a child under 13 may have provided Ranger personal
                            information, please contact us at <Link href="mailto:legal@rangerlabs.io">legal@rangerlabs.io</Link>.
                        </Paragraph>
                    </Section>
                    <Section id="sdk-ownership" text="5. Use and Ownership of SDK Data">
                        <Paragraph>
                            As between the parties, Licensee shall own the SDK Information. Notwithstanding anything to the contrary, Ranger shall have the
                            right to use and store the SDK Information to the maximum extent permitted by law and in accordance with Ranger's{' '}
                            <Link variant="body1" component="button" onClick={() => push(RoutePaths.Privacy)}>
                                privacy policy
                            </Link>
                            . Without limiting the foregoing, Licensee shall not use SDK Information for any of the following purposes: (a) employment
                            eligibility; (b) credit eligibility; (c) health card eligibility; (d) insurance eligibility, underwriting, or pricing; or (e) any
                            other use in violation of applicable laws and regulations.
                        </Paragraph>
                    </Section>
                    <Section id="privacy" text="6. Privacy Compliance">
                        <Paragraph>
                            The parties agree to comply with all applicable privacy laws, and each party agrees to perform the following obligations,
                            respectively:
                        </Paragraph>
                        <Paragraph>
                            a. Licensee is solely responsible for obtaining all applicable consents, approvals, permissions, and authorization from End Users
                            that are necessary to allow Ranger to collect and use the SDK Information in accordance with these Terms and Ranger's{' '}
                            <Link variant="body1" component="button" onClick={() => push(RoutePaths.Privacy)}>
                                privacy policy
                            </Link>
                            . Without limiting the foregoing, Licensee shall publish and maintain privacy policies and disclosures for all Licensee Properties
                            that: (i) comply with all applicable laws and these Terms; and (ii) contain clear disclosures to End Users stating that the SDK
                            Information will be collected and used in accordance with these Terms and Ranger's{' '}
                            <Link variant="body1" component="button" onClick={() => push(RoutePaths.Privacy)}>
                                privacy policy
                            </Link>
                            .
                        </Paragraph>
                        <Paragraph>
                            b. Where Licensee provides any data (e.g., Apple IDFAs, Android advertising IDs, or location data) to Ranger in any manner other
                            than through the Services, including without limitation through an API or an SDK proprietary to Licensee, Licensee shall be solely
                            responsible for ensuring ensure that any such collection and transfer of data is done in full compliance with applicable End User's
                            stated preferences, including without limitation device settings to "Limit Ad Tracking" and "Opt Out of Ads Personalization."
                        </Paragraph>
                    </Section>
                    <Section id="intellectual-property" text="7. Intellectual Property Rights">
                        <Paragraph>
                            Each party acknowledges and agrees that no intellectual property rights (including without limitation any rights based in trademark,
                            copyright, patent or trade secret law) are or are intended to be transferred from one party to the other through these Terms.
                            Neither party shall receive any ownership interest in the other's intellectual property. The Services (and all intellectual property
                            rights therein) are and shall remain the sole property of Ranger, and the Licensee Properties (and all intellectual property rights
                            therein) are and shall remain the sole property of Licensee. Without limiting the foregoing, Ranger may use the name and logo of
                            Licensee solely in order to designate Licensee as a customer for marketing purposes (e.g., on Ranger's website or marketing
                            materials).
                        </Paragraph>
                    </Section>
                    <Section id="warranty" text="8. Warranty Disclaimer">
                        <Paragraph>
                            THE SERVICES ARE PROVIDED TO LICENSEE ON AN "AS-IS" AND "AS AVAILABLE" BASIS. RANGER DOES NOT REPRESENT OR WARRANT THAT THE SERVICES
                            OR THE RESULTS OBTAINED FROM THEIR USE SHALL MEET THE REQUIREMENTS OR BUSINESS NEEDS OF LICENSEE OR ITS CUSTOMERS OR THAT THE
                            SERVICES' OPERATION SHALL BE UNINTERRUPTED OR ERROR-FREE. RANGER AND ITS LICENSORS, AFFILIATES, AND SUPPLIERS MAKE NO
                            REPRESENTATIONS AND WARRANTIES UNDER THESE TERMS, AND HEREBY EXPRESSLY DISCLAIM ALL WARRANTIES, WHETHER WRITTEN OR ORAL, EXPRESS OR
                            IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY WARRANTIES OF TITLE OR NON-INFRINGEMENT, ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR
                            FITNESS FOR A PARTICULAR PURPOSE, AND ANY IMPLIED WARRANTIES ARISING FROM COURSE OF DEALING OR COURSE OF PERFORMANCE.
                        </Paragraph>
                    </Section>
                    <Section id="limitations" text="9. Limitations of Liability">
                        <Paragraph>
                            TO THE FULLEST EXTENT ALLOWED BY APPLICABLE LAW, UNDER NO CIRCUMSTANCES AND UNDER NO LEGAL THEORY (INCLUDING, WITHOUT LIMITATION,
                            TORT, CONTRACT, STRICT LIABILITY, OR OTHERWISE) SHALL RANGER (OR ITS LICENSORS OR SUPPLIERS) BE LIABLE TO LICENSEE OR TO ANY OTHER
                            PERSON FOR: (A) ANY INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES OF ANY KIND, INCLUDING DAMAGES FOR LOST PROFITS, LOSS OF
                            GOODWILL, WORK STOPPAGE, ACCURACY OF RESULTS, OR COMPUTER FAILURE OR MALFUNCTION; OR (B) ANY AMOUNT, IN THE AGGREGATE, IN EXCESS OF
                            THE GREATER OF (I) $100 OR (II) THE AMOUNTS PAID BY YOU TO RANGER IN CONNECTION WITH THE SERVICES IN THE TWELVE (12) MONTH PERIOD
                            PRECEDING THIS APPLICABLE CLAIM, OR (III) ANY MATTER BEYOND RANGER'S REASONABLE CONTROL. SOME STATES DO NOT ALLOW THE EXCLUSION OR
                            LIMITATION OF CERTAIN DAMAGES, SO THE ABOVE LIMITATION AND EXCLUSIONS MAY NOT APPLY TO YOU.
                        </Paragraph>
                    </Section>
                    <Section id="force-majeure" text="10. Force Majeure">
                        <Paragraph>
                            Except for payment obligations, neither party shall have any liability for any failure or delay resulting from any condition beyond
                            the reasonable control of such party, including governmental action or acts of terrorism, earthquake or other acts of God, labor
                            conditions, and power failures. Each party shall promptly notify the other party upon becoming aware that any such event has
                            occurred or is likely to occur and shall use its best efforts to minimize any resulting delay in or interference with the
                            performance of its obligations under these Terms.
                        </Paragraph>
                    </Section>
                    <Section id="indemnification" text="11. Indemnification">
                        <Paragraph>
                            Licensee agrees to indemnify, defend, and hold Ranger and its affiliates and their respective directors, officers, employees, and
                            agents (collectively, <Bold>"Indemnified Ranger Persons"</Bold>) harmless from and against any and all claims, liabilities, damages
                            (actual and consequential), losses and expenses (including attorneys' fees) arising from or in any way related to any third party
                            claims relating to: (i) Licensee's violation of these Terms; (ii) Licensee's violation of any applicable law or regulation; or (iii)
                            Licensee's violation of Licensee's privacy policy or any person's privacy rights. In the event of such a claim, suit, or action (
                            <Bold>"Claim"</Bold>), Ranger will attempt to provide notice of the Claim to the contact information Ranger has for Licensee's
                            account (provided that failure to deliver such notice shall not eliminate or reduce Licensee's indemnification obligations
                            hereunder).
                        </Paragraph>
                    </Section>
                    <Section id="miscellaneous" text="12. Miscellaneous">
                        <Paragraph>
                            a. <Bold>Governing Law.</Bold> These Terms shall be governed by the laws of the State of Ohio without regard to choice of law
                            principles.
                        </Paragraph>
                        <Paragraph>
                            b. <Bold>Arbitration.</Bold> Any controversy or claim arising out of or in any way connected with these Terms shall be finally
                            settled in Cuyahoga County, Ohio, in English, in accordance with the Streamlined Arbitration Rules and Procedures of Judicial
                            Arbitration and Mediation Services, Inc. ("JAMS") then in effect, by one commercial arbitrator with substantial experience in
                            resolving intellectual property and commercial contract disputes, who shall be selected from the appropriate list of JAMS
                            arbitrators in accordance with such Rules. Judgment upon the award rendered by such arbitrator may be entered in any court of
                            competent jurisdiction. Notwithstanding the foregoing obligation to arbitrate disputes, each party shall have the right to pursue
                            injunctive or other equitable relief at any time, from any court of competent jurisdiction. For all purposes of this Agreement, the
                            parties consent to exclusive jurisdiction and venue in the state or federal courts located in Cuyahoga County, Ohio.{' '}
                            <Bold>
                                Any arbitration under these Terms will take place on an individual basis: class arbitrations and class actions are not
                                permitted. YOU UNDERSTAND AND AGREE THAT BY ENTERING INTO THESE TERMS, YOU AND RANGER ARE EACH WAIVING THE RIGHT TO TRIAL BY
                                JURY OR TO PARTICIPATE IN A CLASS ACTION.
                            </Bold>
                        </Paragraph>
                        <Paragraph>
                            c. <Bold>Assignment.</Bold> Licensee may not assign or delegate any rights or obligations under these Terms to any third party
                            without Ranger's prior written consent. Notwithstanding the foregoing, Licensee may assign these Terms (along with all rights and
                            obligations under it) to any of its corporate affiliates, parents or subsidiaries, or in conjunction with a merger or sale or
                            transfer of all or substantially all of its assets or business associated with performance under these Terms, provided that Licensee
                            shall provide Ranger timely notice of such assignment. Ranger may freely assign these Terms and its rights and obligations hereunder
                            without consent.
                        </Paragraph>
                        <Paragraph>
                            d. <Bold>Relationship of the Parties.</Bold> The parties agree they are independent contractors to each other in performing their
                            respective obligations hereunder. Nothing in these Terms or in the working relationship being established and developed hereunder
                            shall be deemed, nor shall it cause, the parties to be treated as partners, employee/employer, joint venturers, or otherwise as
                            joint associates for profit.
                        </Paragraph>
                        <Paragraph>
                            e. <Bold>No Waiver.</Bold> Except as otherwise provided herein, the failure of either party to enforce at any time the provisions of
                            these Terms shall not be constituted to be a present or future waiver of such provisions, nor in any way affect the ability of
                            either party to enforce each and every such provision thereafter.
                        </Paragraph>
                        <Paragraph>
                            f. <Bold>Severability.</Bold> If any provision of these Terms is held invalid or unenforceable at law, such provision shall be
                            deemed stricken from these Terms and the remainder of these Terms shall continue in effect and be valid and enforceable to the
                            fullest extent permitted by applicable law.
                        </Paragraph>
                        <Paragraph>
                            g. <Bold>Entire Agreement.</Bold> These Terms and Ranger's{' '}
                            <Link variant="body1" component="button" onClick={() => push(RoutePaths.Privacy)}>
                                privacy policy
                            </Link>{' '}
                            are the entire agreement between the parties and supersede any and all prior understandings, agreements, or representations by or
                            between the parties, written or oral, which may have related to the subject matter hereof. There are no third party beneficiaries to
                            these Terms.
                        </Paragraph>
                        <Paragraph>
                            h. <Bold>Survival.</Bold> Provisions that, by their nature, should survive termination of these Terms shall survive termination. By
                            way of example, all of the following will survive termination: any obligation Licensee has to pay or indemnify Ranger, any
                            limitations on Ranger's liability, any terms regarding ownership or intellectual property rights, and terms regarding disputes
                            between the parties.
                        </Paragraph>
                    </Section>
                    <Section id="changes" text="13. Changes">
                        <Paragraph>
                            Ranger may make changes to these Terms in its sole discretion from time to time. When we do, we will revise the "last updated" date
                            given below. It is your responsibility to review these Terms frequently and to remain informed of any changes. The then-current
                            version of these Terms will supersede all earlier versions. You agree that your continued use of the Services after such changes
                            have been published to will constitute your acceptance of the revised Terms.
                        </Paragraph>
                    </Section>
                    <Paragraph>Last updated: September 12, 2020</Paragraph>
                </Grid>
            </Grid>
            <GetStartedForFree />
            <Footer />
        </React.Fragment>
    );
}

export default connect(null, { push })(TermsOfUse);
