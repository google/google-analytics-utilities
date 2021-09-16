/**
 * Copyright 2021 Google LLC
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const ga4BaseRequestUrl = 'https://analyticsadmin.googleapis.com/v1alpha/';
const ga4RequestDelay = 100;
const ga4RequestSuffix = {
  accountSummaries: 'accountSummaries',
  accounts: 'accounts',
  androidAppDataStreams: '/androidAppDataStreams',
  firebaseLinks: '/firebaseLinks',
  googleAdsLinks: '/googleAdsLinks',
  iosAppDataStreams: '/iosAppDataStreams',
  webDataStreams: '/webDataStreams',
  enhancedMeasurementSettings: '/enhancedMeasurementSettings',
  globalSiteTag: '/getGlobalSiteTag',
  customDimensions: '/customDimensions',
  customMetrics: '/customMetrics',
  conversionEvents: '/conversionEvents',
  auditPropertyUserLinks: '/userLinks:audit',
};

/**
 * Returns the UrlFetchApp options, including header, method, payload, etc.
 * for requests to the Analytics Admin API.
 * @param {string} method Either POST or GET.
 * @param {?Object} payload The payload data for the request.
 * @return {!Object} Authorization header.
 */
function getOptions(method, payload) {
  const options = {
    'headers': {
      'authorization': 'Bearer ' + ScriptApp.getOAuthToken()
    },
    'muteHttpExceptions': true
  };
  if (method != undefined) {
    options.method = method;
  }
  if (payload != undefined) {
    options.payload = JSON.stringify(payload);
    options.headers['Content-Type'] = 'application/json';
  }
  return options;
}

/**
 * Lists most GA4 entities.
 * @param {string} requestSuffix The suffix for the entity to be listed.
 * @param {string} pageToken The token for the next page to be retrieved.
 * @return {!Object} Either a response from the API or an error message.
 */
function listGA4Entities(requestSuffix, pageToken) {
  try {
    requestSuffix += '?pageSize=200';
    if (pageToken != undefined) {
      requestSuffix += '&pageToken=' + pageToken;
    }
    const data = JSON.parse(UrlFetchApp.fetch(
      ga4BaseRequestUrl + requestSuffix,
      getOptions()
    ).getContentText());
    Utilities.sleep(ga4RequestDelay);
    return data;
  } catch(e) {
    return e;
  }
}

function archiveGA4CustomDefinition(customDefinitionName) {
  try {
    const data = UrlFetchApp.fetch(
			ga4BaseRequestUrl + customDefinitionName + ':archive',
			getOptions('POST')
		);
		Utilities.sleep(ga4RequestDelay);
		return data;
  } catch(e) {
    console.log(e);
    return e;
  }
}

function createGA4Entity(requestSuffix, payload) {
  try {
    const data = UrlFetchApp.fetch(
			ga4BaseRequestUrl + requestSuffix, 
			getOptions('POST', payload)
		);
		Utilities.sleep(ga4RequestDelay);
		return data;
  } catch(e) {
    console.log(e);
    return e;
  }
}

function deleteGA4Entity(entityPath) {
  try {
    const data = UrlFetchApp.fetch(
			ga4BaseRequestUrl + entityPath,
			getOptions('DELETE')
		);
		Utilities.sleep(ga4RequestDelay);
		return data;
  } catch(e) {
    console.log(e);
    return e;
  }
}

function listGA4Properties(id, filterType) {
  let filter = '';
  if (filterType == 'account') {
    filter = 'parent:accounts/' + id;
  } else if (filterType == 'firebase') {
    filter = 'firebase_project:' + id;
  }
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + 'properties?filter=' + filter,
		getOptions()
	).getContentText());
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function auditGA4UserLinks(level, pageToken) {
  requestSuffix = '?pageSize=5000';
  if (pageToken != undefined) {
    requestSuffix += '&pageToken=' + pageToken;
  }
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + level + '/userLinks:audit' + requestSuffix,
		getOptions()
	).getContentText());
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function getEnhancedMeasurementSettings(webDataStreamName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + webDataStreamName + '/enhancedMeasurementSettings', 
		getOptions()).getContentText()
	);
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function getGlobalSiteTag(webDataStreamName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + webDataStreamName + '/getGlobalSiteTag', 
		getOptions()).getContentText()
	);
	Utilities.sleep(ga4RequestDelay);
	return data;
}