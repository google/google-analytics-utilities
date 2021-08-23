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

/**
 * Returns the UrlFetchApp options, including header, method, payload, etc.
 * requests to the Analytics Admin API.
 * @param {string} method Either POST or GET.
 * @param {?Object} data The payload data for the request.
 * @return {!Object} Authorization header.
 */
function getOptions(method, data) {
  const options = {
    'headers': {
      'authorization': 'Bearer ' + ScriptApp.getOAuthToken()
    },
    'muteHttpExceptions': true
  };
  if (method != undefined) {
    options.method = method;
  }
  if (data != undefined) {
    if (data.payload != undefined) {
      options.payload = JSON.stringify(data.payload);
      options.headers['Content-Type'] = 'application/json';
    }
  }
  return options;
}

function listGA4AccountSummaries(pageToken) {
  let suffix = '?pageSize=200';
  if (pageToken != undefined) {
    suffix += '&pageToken=' + pageToken;
  }
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + 'accountSummaries' + suffix,
		getOptions()
	).getContentText());
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function listGA4Accounts() {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + 'accounts', getOptions()).getContentText()
	);
	Utilities.sleep(ga4RequestDelay);
	return data;
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

function listGA4AuditAccountUserLinks(accountName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + accountName + '/userLinks:audit',
		getOptions()
	).getContentText());
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function listGA4AuditPropertyUserLinks(propertyName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + propertyName + '/userLinks:audit', 
		getOptions()).getContentText()
	);
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function listGA4AndroidAppDataStreams(propertyName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + propertyName + '/androidAppDataStreams',
		getOptions()).getContentText()
	);
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function listGA4FirebaseLinks(propertyName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + propertyName + '/firebaseLinks', 
		getOptions()).getContentText()
	);
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function listGA4GoogleAdsLinks(propertyName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + propertyName + '/googleAdsLinks', 
		getOptions()).getContentText()
	);
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function listGA4iosAppDataStreams(propertyName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + propertyName + '/iosAppDataStreams', 
		getOptions()).getContentText()
	);
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function listGA4WebStreams(propertyName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + propertyName + '/webDataStreams', 
		getOptions()).getContentText()
	);
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

function listGA4CustomDimensions(propertyName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + propertyName + '/customDimensions', 
		getOptions()).getContentText()
	);
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function createGA4CustomDimension(propertyName, data) {
  try {
    const data = UrlFetchApp.fetch(
			ga4BaseRequestUrl + propertyName + '/customDimensions', 
			getOptions('POST',data)
		);
		Utilities.sleep(ga4RequestDelay);
		return data;
  } catch(e) {
    console.log(e);
    return e;
  }
}

function archiveGA4CustomDimension(customDimensionName) {
  try {
    const data = UrlFetchApp.fetch(
			ga4BaseRequestUrl + customDimensionName + ':archive',
			getOptions('POST')
		);
		Utilities.sleep(ga4RequestDelay);
		return data;
  } catch(e) {
    console.log(e);
    return e;
  }
}

function listGA4CustomMetrics(propertyName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + propertyName + '/customMetrics', 
		getOptions()
	).getContentText());
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function createGA4CustomMetric(propertyName, data) {
  try {
    const data = UrlFetchApp.fetch(
			ga4BaseRequestUrl + propertyName + '/customMetrics', 
			getOptions('POST',data)
		);
		Utilities.sleep(ga4RequestDelay);
		return data;
  } catch(e) {
    console.log(e);
    return e;
  }
}

function archiveGA4CustomMetric(customMetricName) {
  try {
    const data = UrlFetchApp.fetch(
			ga4BaseRequestUrl + customMetricName + ':archive',
			getOptions('POST')
		);
		Utilities.sleep(ga4RequestDelay);
		return data;
  } catch(e) {
    console.log(e);
    return e;
  }
}

function listGA4ConversionEvents(propertyName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + propertyName + '/conversionEvents', 
		getOptions()).getContentText()
	);
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function listGA4AdsLinks(propertyName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + propertyName + '/googleAdsLinks', 
		getOptions()
	).getContentText());
	Utilities.sleep(ga4RequestDelay);
	return data;
}

function listGA4FirebaseLinks(propertyName) {
  const data = JSON.parse(UrlFetchApp.fetch(
		ga4BaseRequestUrl + propertyName + '/firebaseLinks', 
		getOptions()
	).getContentText());
	Utilities.sleep(ga4RequestDelay);
	return data;
}