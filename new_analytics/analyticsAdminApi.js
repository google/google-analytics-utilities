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

const ga4RequestDelay = 100;
const ga4Resource = {
  accountSummaries: AnalyticsAdmin.AccountSummaries,
  accounts: AnalyticsAdmin.Accounts,
  dataStreams: AnalyticsAdmin.Properties.DataStreams,
  firebaseLinks: AnalyticsAdmin.Properties.FirebaseLinks,
  googleAdsLinks: AnalyticsAdmin.Properties.GoogleAdsLinks,
  customDimensions: AnalyticsAdmin.Properties.CustomDimensions,
  customMetrics: AnalyticsAdmin.Properties.CustomMetrics,
  conversionEvents: AnalyticsAdmin.Properties.ConversionEvents,
  displayVideo360AdvertiserLinks: AnalyticsAdmin.Properties.DisplayVideo360AdvertiserLinks
};

/**
 * Lists most GA4 entities.
 * @param {string} resourceKey The GA4 entity being requested.
 * @param {string} parent
 * @return {!Object} Either a response from the API or an error message.
 */
function listGA4Entities(resourceKey, parent) {
  try {
    const options = {pageSize: 200};
    let response = {};
    if (parent != undefined) {
      response = ga4Resource[resourceKey].list(parent, options);
    } else {
      response = ga4Resource[resourceKey].list(options);
    }
    options.pageToken = response.nextPageToken;
    Utilities.sleep(ga4RequestDelay);
    while (options.pageToken != undefined) {
      const nextPage = ga4Resource[resourceKey].list(options);
      response[resourceKey] = response[resourceKey].concat(nextPage.accountSummaries);
      options.pageToken = nextPage.nextPageToken;
      Utilities.sleep(ga4RequestDelay);
    }
    return response;
  } catch(e) {
    return e;
  }
}

function archiveGA4CustomDefinition(resourceKey, customDefinitionName) {
  try {
    const response = ga4Resource[resourceKey].archive({}, customDefinitionName)
		Utilities.sleep(ga4RequestDelay);
		return response;
  } catch(e) {
    console.log(e);
    return e;
  }
}

function createGA4Entity(resourceKey, name, payload) {
  try {
    const response = ga4Resource[resourceKey].create(payload, name);
		Utilities.sleep(ga4RequestDelay);
		return response;
  } catch(e) {
    console.log(e);
    return e;
  }
}

function deleteGA4Entity(resourceKey, name) {
  try {
    const response = ga4Resource[resourceKey].remove(name);
		Utilities.sleep(ga4RequestDelay);
		return response;
  } catch(e) {
    console.log(e);
    return e;
  }
}