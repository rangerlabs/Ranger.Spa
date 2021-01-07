import { OutlineElement } from '../docComponents/OutlineElement';
import React from 'react';
import Introduction from '../docComponents/Introduction';
import Paragraph from '../docComponents/Paragraph';
import Outline from '../docComponents/Outline';
import Section from '../docComponents/Section';
import { Link } from '@material-ui/core';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import RoutePaths from '../../../RoutePaths';
import DescriptiveList, { Description } from '../docComponents/DescriptiveList';
import Code from '../textEnhancers/Code';
import SubSection from '../docComponents/SubSection';
import DocRoutePaths from '../DocRoutePaths';
import { scrollToLandingId } from '../../../../helpers/Helpers';
import Bold from '../textEnhancers/Bold';

export const SdksDocOutline = [
	{
		name: 'SDKs Reference',
		id: 'sdks-section',
	},
	{
		name: 'Swift',
		id: 'swift-section',
		subElements: [
			{
				name: 'API Client v1',
				id: 'swift-api-client-v1-section',
			},
			{
				name: 'Tracker v1',
				id: 'swift-tracker-v1-section',
			},
		],
	},
] as OutlineElement[];

interface SdkDocsProps extends IDocProps {
	push: typeof push;
}

const swiftApiClientV1Descriptions = [
	{
		title: 'RangerSwiftApiClientV1.PostBreadcrumb(breadcrumb: Breadcrumb, apiKey: String, completionHandler: @escaping ((RangerApiResponse<Data>) -> Void))',
		description: 'Post a Breadcrumb using the provided apiKey and register a callback function',
	},
	{
		title:
			'RangerSwiftApiClientV1.GetGeofenceByExternalId(apiKey: String, externalId: String, completionHandler: @escaping ((RangerApiResponse<Geofence>) -> Void))',
		description: 'Get a Geofence by externalId and register a callback function',
	},
	{
		title:
			'GetPaginatedGeofences(apiKey: String, search: String = "", sortOrder: SortOrders = .desc, orderBy: OrderByOptions = .createdDate, pageCount: Int = 100, page: Int = 0, completionHandler: @escaping ((RangerApiResponse<[Geofence]>) -> Void))',
		description: 'Get paginated Geofences and register a callback function; pageCount: [1, 1000], page: >= 0',
	},
	{
		title: 'CreateGeofence(apiKey: String, geofence: Geofence, completionHandler: @escaping ((RangerApiResponse<Data>) -> Void))',
		description: 'Create a Geofence and register a callback function',
	},
	{
		title: 'UpdateGeofence(apiKey: String, geofence: Geofence, completionHandler: @escaping ((RangerApiResponse<Data>) -> Void))',
		description: 'Update a Geofence and register a callback function; geofence.id is required',
	},
	{
		title: 'DeleteGeofence(apiKey: String, externalId: String, completionHandler: @escaping ((RangerApiResponse<Data>) -> Void))',
		description: 'Delete a geofence and register a callback function',
	},
	{
		title: 'BulkDeleteGeofences(apiKey: String, externalIds: [String], completionHandler: @escaping ((RangerApiResponse<Data>) -> Void))',
		description: 'Bulk delete Geofences and register a callback function',
	},
	{
		title: 'GetIntegrations(apiKey: String, completionHandler: @escaping ((RangerApiResponse<[Integration]>) -> Void))',
		description: 'Get Integrations and register a callback function',
	},
] as Description[];

const swiftTrackerV1Descriptions = [
	{
		title: 'RangerTrackerV1.requestWhenInUseAuthorization()',
		description:
			'Calls requestWhenInUseAuthorization() on the underlying CLLocationManager, must be called before tracking if requesting When In Use authorization',
	},
	{
		title: 'RangerTrackerV1.requestAlwaysAuthorization()',
		description: 'Calls requestAlwaysAuthorization() on the underlying CLLocationManager, must be called before tracking if requesting Always authorization',
	},
	{
		title: 'RangerTrackerV1.configure(deviceId: String, breadcrumbApiKey: String)',
		description: 'Configures the Tracker for the device and an anonymous user',
	},
	{
		title: 'RangerTrackerV1.configure(deviceId: String, externalUserId: String, breadcrumbApiKey: String)',
		description: 'Configures the Tracker for the device and a user',
	},
	{
		title: 'RangerTrackerV1.setExternalId(externalId: String)',
		description: "Sets the user's External Id after the Tracker has been configured",
	},
	{
		title: 'RangerTrackerV1.setBreadcrumbMetadata(metadata: [KeyValuePair])',
		description: 'Sets the Breadcrumb Metadata to include in the Breadcrumb request. Should never contain PII',
	},
	{
		title:
			'RangerTrackerV1.trackStandardLocation(desiredAccuracy: CLLocationAccuracy = kCLLocationAccuracyBest, distanceFilter: CLLocationDistance = kCLDistanceFilterNone, pauseLocationUpdatesAutomatically: Bool = false, activityType: CLActivityType = .other)',
		description: 'Configures the underlying CLLocationManger using standard location',
	},
	{
		title: 'RangerTrackerV1.trackSignificantLocationChanges(pauseLocationUpdatesAutomatically: Bool = false, activityType: CLActivityType = .other)',
		description: 'Configures the underlying CLLocationManger using significant location changes',
	},
	{
		title: 'RangerTrackerV1.allowsBackgroundLocationUpdates(allowsBackgroundLocationUpdates: Bool = true, showBackgroundLocationIndicator: Bool = false)',
		description: 'Configures background location updates on the underlying CLLocationManager',
	},
	{
		title: 'RangerTrackerV1.setApiBaseUrl(url: String)',
		description: 'Used by the Ranger Team for testing against pre-production environments',
	},
	{
		title: 'RangerTrackerV1.context',
		description: "A @Published property which exposes the Tracker's internal state",
	},
	{
		title: 'PusherNotifier.pusherConnect(pusherKey: String, cluster: String, completionHandler: @escaping ((GeofenceEvent) -> Void))',
		description:
			'If the Pusher integration is configured, used to connect to your Pusher Channel and register a callback function when a Geofence Event is raised',
	},
] as Description[];

const SdksDoc = function (props: SdkDocsProps) {
	return (
		<React.Fragment>
			<Introduction id="sdks-section" text="SDK Reference">
				<Paragraph>This section documents the available Ranger SDKs for quickly integrating mobile applications with Ranger.</Paragraph>
				<Paragraph>
					Ranger's SDKs are broken into two components, the API Client and the Tracker. Ranger's API Client is versioned against the Ranger API version it
					communicates requests to and can be used independently of the Tracker. Ranger's Tracker encapsulates tracking functionality for the client and
					references the appropriately versioned API Client. Seperating and independently versioning the API Client implementation from the Tracker
					implementation provides greater flexibility for client's needs.
				</Paragraph>
				<Paragraph>
					Ranger's SDKs are Open Source and availble under the Apache 2.0 license. Their source code is available on{' '}
					<Link component="button" href="https://github.com/rangerlabs">
						GitHub
					</Link>
					.
				</Paragraph>
			</Introduction>
			{props.showOutline && <Outline elements={SdksDocOutline} />}
			<Section text="Swift" id="swift-section">
				<Paragraph>The Ranger API Client v1 utilizes the availble API Version v1 endpoints.</Paragraph>
				<SubSection text="Swift API Client v1" id="swift-api-client-v1-section">
					<SubSection text="Installation and usage" id="swift-api-client-v1-install-section">
						<Paragraph>Ranger's Swift API Client v1 is availble as a CocoaPod. It can be installed by adding the following to your PodFile.</Paragraph>
						<Paragraph>
							<Code>pod 'Ranger.Swift.ApiClientV1'</Code>
						</Paragraph>
						<Paragraph>The SDK can then be imported:</Paragraph>
						<Paragraph>
							<Code>import Ranger_Swift_ApiClientV1</Code>
						</Paragraph>
					</SubSection>
					<SubSection text="Methods" id="swift-api-client-v1-methods-section">
						<Paragraph>The following describes methods currently availble on the API Client.</Paragraph>
						<DescriptiveList descriptions={swiftApiClientV1Descriptions} />
					</SubSection>
				</SubSection>
				<SubSection text="Swift Tracker v1" id="swift-tracker-v1-section">
					<Paragraph>
						The Ranger Tracker v1 uses the{' '}
						<Link variant="caption" component="button" onClick={() => scrollToLandingId('swift-api-client-v1-section')}>
							API Client v1
						</Link>{' '}
						to configure tracking, send{' '}
						<Link component="button" onClick={() => props.push(RoutePaths.Docs.replace(':name?', DocRoutePaths.Breadcrumbs))} variant="body1">
							Breadcrumbs
						</Link>
						, and receive events from a configured Pusher subscription.
					</Paragraph>
					<SubSection text="Installation and usage" id="swift-tracker-v1-install-section">
						<Paragraph>Ranger's Swift Tracker v1 is availble as a CocoaPod. It can be installed by adding the following to your PodFile.</Paragraph>
						<Paragraph>
							<Code>pod 'Ranger.Swift.TrackerV1'</Code>
						</Paragraph>
						<Paragraph>The SDK can then be imported:</Paragraph>
						<Paragraph>
							<Code>import Ranger_Swift_TrackerV1</Code>
						</Paragraph>
						<Paragraph>
							Before calling any tracking methods on the Tracker, it is necessary to call <Code>RangerTrackerV1.configure()</Code> to configure the Tracker.
							Once configured, your application may request authorization using either <Code>RangerTrackerV1.requestWhenInUseAuthorization()</Code> or{' '}
							<Code>RangerTrackerV1.requestAlwaysAuthorization()</Code>. You can then begin tracking of the device by calling either{' '}
							<Code>RangerTrackerV1.trackStandardLocation()</Code> or
							<Code>RangerTrackerV1.trackSignificantLocationChanges()</Code>.
						</Paragraph>
						<Paragraph>
							The Tracker also includes the <Code>PusherNotifier</Code>. The PusherNotifier can be configured to connect to the Pusher Channel defined in your
							Pusher Integration. The <Code>PusherNotifier.connect()</Code> method allows for a callback handler to defined and will execute whenever a Geofence
							Event occurs. Within the callback handler it's possible to raise notifications, alerts, or begin location specific in-app actions. For an example
							on how to use the <Code>PusherNotifier</Code>, visit the Swift Demo on our{' '}
							<Link component="button" href="https://github.com/rangerlabs">
								GitHub
							</Link>
						</Paragraph>
						<Paragraph>
							Remember, when requesting location services on iOS, it is necessary to a meaningful Purpose String in the <Bold>Info.plist</Bold> file. When
							requesting When In Use authorization or Always authorization, set a meaningful value for NSLocationWhenInUseUsageDescription. When requesting
							Always Authorization set a meaningful value for NSLocationAlwaysAndWhenInUseUsageDescription.
						</Paragraph>
					</SubSection>
					<SubSection text="Properties and methods" id="swift-tracker-v1-methods-section">
						<Paragraph>The following describes methods currently availble on the Tracker.</Paragraph>
						<DescriptiveList descriptions={swiftTrackerV1Descriptions} />
					</SubSection>
				</SubSection>
			</Section>
		</React.Fragment>
	);
};

export default connect(null, { push })(SdksDoc);
