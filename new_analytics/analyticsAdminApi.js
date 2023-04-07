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
    let response = {};
    if (resourceKey == 'enhancedMeasurementSettings') {
      response = ga4Resource.streams.getEnhancedMeasurementSettings(parent);
    } else if (resourceKey == 'attributionSettings') {
      response = ga4Resource.properties.getAttributionSettings(parent);
    } else if (resourceKey == 'dataRetentionSettings') {
      response = ga4Resource.properties.getDataRetentionSettings(parent);
    } else {
      response = ga4Resource[resourceKey].get(parent);
    }
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
      } else if (resourceKey == 'connectedSiteTags') {
        response = ga4Resource.properties.listConnectedSiteTags(parent); 
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

function archiveGA4CustomDefinition(resourceKey, resourceName) {
  try {
    const response = ga4Resource[resourceKey].archive({}, resourceName);
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
    } else if (resourceKey == 'connectedSiteTags') {
      response = ga4Resource.properties.createConnectedSiteTag(payload);
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
    let response = {};
    if (resourceKey == 'connectedSiteTags') {
      response = ga4Resource.properties.deleteConnectedSiteTag(name);
    } else {
      response = ga4Resource[resourceKey].remove(name);
    }
		Utilities.sleep(ga4RequestDelay);
		return response;
  } catch(e) {
    console.log(e);
    return e;
  }
}

function updateGA4Entity(resourceKey, name, payload) {
  try {
    let mask = '';
    let response = {};
    if (resourceKey == 'customMetrics') {
      if (payload.measurementUnit == 'CURRENCY') {
        delete payload.measurementUnit;
        mask = 'displayName,description,restrictedMetricType';
      } else {
        mask = 'displayName,measurementUnit,description,restrictedMetricType';
      }
    } else if (resourceKey == 'audiences') {
      for (field in payload) {
        mask += field + ','
      }
    } else if (resourceKey == 'attributionSettings') {
      mask = 'acquisitionConversionEventLookbackWindow,otherConversionEventLookbackWindow,reportingAttributionModel';
    } else {
      mask = '*';
    }
    if (resourceKey == 'accountAccessBindings' || 
      resourceKey == 'propertyAccessBindings') {
      response = ga4Resource[resourceKey].patch(payload, name);
    } else if (resourceKey = 'dataRetentionSettings') {
      response = ga4Resource.properties.updateDataRetentionSettings(
        payload, name, {updateMask: mask}
      );
    } else if (resourceKey = 'attributionSettings') {
      response = ga4Resource.properties.updateAttributionSettings(
        payload, name, {updateMask: mask}
      );
    } else if (resourceKey = 'enhancedMeasurementSettings') {
      response = ga4Resource.streams.updateEnhancedMeasurementSettings(
        payload, name, {updateMask: mask}
      );
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

/**
 * 
 */
function updateEnhancedMeasurementSettings(settings, parent) {
  try {
    let response = '';
    response = AnalyticsAdmin.Properties.DataStreams
    .updateEnhancedMeasurementSettings(settings, parent, {updateMask: '*'});
		Utilities.sleep(ga4RequestDelay);
		return response;
  } catch(e) {
    console.log(e);
    return e;
  }
}
          