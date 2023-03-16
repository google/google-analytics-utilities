/**
 * Copyright 2022 Google LLC
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
  streams: AnalyticsAdmin.Properties.DataStreams,
  firebaseLinks: AnalyticsAdmin.Properties.FirebaseLinks,
  googleAdsLinks: AnalyticsAdmin.Properties.GoogleAdsLinks,
  customDimensions: AnalyticsAdmin.Properties.CustomDimensions,
  customMetrics: AnalyticsAdmin.Properties.CustomMetrics,
  conversionEvents: AnalyticsAdmin.Properties.ConversionEvents,
  displayVideo360AdvertiserLinks: AnalyticsAdmin.Properties.DisplayVideo360AdvertiserLinks,
  properties: AnalyticsAdmin.Properties,
  audiences: AnalyticsAdmin.Properties.Audiences,
  accountAccessBindings: AnalyticsAdmin.Accounts.AccessBindings,
  propertyAccessBindings: AnalyticsAdmin.Properties.AccessBindings,
  searchAds360Links: AnalyticsAdmin.Properties.SearchAds360Links,
  bigqueryLinks: AnalyticsAdmin.Properties.BigQueryLinks,
  expandedDataSets: AnalyticsAdmin.Properties.ExpandedDataSets
};

/**
 * Gets a resource.
 * @param {string} resourceKey The GA4 entity being requested.
 * @param {string} parent
 * @return {!Object} Either a response from the API or an error message.
 */
function getGA4Resource(resourceKey, parent) {
  try {
    let response = ga4Resource[resourceKey].get(parent);
    Utilities.sleep(ga4RequestDelay);
    return response;
  } catch(e) {
    console.log(e);
    return e;
  }
}

/**
 * Lists most GA4 entities.
 * @param {string} resourceKey The GA4 entity being requested.
 * @param {string} parent
 * @return {!Object} Either a response from the API or an error message.
 */
function listGA4Entities(resourceKey, parent) {
  try {
    let items = resourceKey;
    const options = {pageSize: 200};
    let response = {};
    if (parent != undefined) {
      if (resourceKey == 'properties') {
        parent.pageSize = 200;
        response = ga4Resource[resourceKey].list(parent);
      } else if (resourceKey == 'accountAccessBindings' || 
        resourceKey == 'propertyAccessBindings') { 
        items = 'userBindings';
        response = ga4Resource[resourceKey].list(parent, options);
      } else {
        response = ga4Resource[resourceKey].list(parent, options);
      }
    } else {
      response = ga4Resource[resourceKey].list(options);
    }
    options.pageToken = response.nextPageToken;
    Utilities.sleep(ga4RequestDelay);
    while (options.pageToken != undefined) {
      const nextPage = ga4Resource[resourceKey].list(options);
      response[items] = response[items].concat(nextPage[items]);
      options.pageToken = nextPage.nextPageToken;
      Utilities.sleep(ga4RequestDelay);
    }
    return response;
  } catch(e) {
    console.log(e);
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
    let response = {};
    if (resourceKey == 'properties') {
      payload.parent = name;
      response = ga4Resource[resourceKey].create(payload);
    } else {
      response = ga4Resource[resourceKey].create(payload, name);
    }
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

function updateGA4Entity(resourceKey, name, payload, index) {
  try {
    let mask = '';
    let response = {};
    if (resourceKey == 'customMetrics') {
      const customMetrics = JSON.parse(CacheService.getUserCache().get('customMetrics'));
      if (customMetrics[index][4] != payload.displayName) {
        mask = 'displayName';
      }
      if (customMetrics[index][8] != 'CURRENCY' && customMetrics[index][8] != payload.measurementUnit) {
        if (mask != '') {
          mask += ',measurementUnit';
        } else {
          mask = 'measurementUnit';
        }
      }
      if (customMetrics[index][9] != payload.description) {
        if (mask != '') {
          mask += ',description';
        } else {
          mask = 'description';
        }
      }
    } else if (resourceKey == 'audiences') {
      for (field in payload) {
        mask += field + ','
      }
    } else {
      mask = '*';
    }
    if (resourceKey == 'accountAccessBindings' || 
      resourceKey == 'propertyAccessBindings') {
      response = ga4Resource[resourceKey].patch(payload, name);
    } else {
      response = ga4Resource[resourceKey].patch(
        payload, name, {updateMask: mask});
    }
		Utilities.sleep(ga4RequestDelay);
		return response;
  } catch(e) {
    console.log(e);
    return e;
  }
}

/**
 * Updates the data retention settings for a property.
 * @returns {!Object} Either the updated data retention setting or an error
 */
function updateDataRetentionSettings(
  evenDataRetention, resetUserDataOnNewActivity, parent) {
  try {
    let response = '';
    response = AnalyticsAdmin.Properties.updateDataRetentionSettings({
      eventDataRetention: evenDataRetention,
      resetUserDataOnNewActivity: resetUserDataOnNewActivity
    }, parent, {updateMask: '*'});
		Utilities.sleep(ga4RequestDelay);
		return response;
  } catch(e) {
    console.log(e);
    return e;
  }
}
          