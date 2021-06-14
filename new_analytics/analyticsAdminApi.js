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

/**
 * Returns the authorization header for requests to the Analytics Admin API.
 * @return {!Object} Authorization header.
 */
function getOptions() {
  return {
    'headers': {
      'authorization': 'Bearer ' + ScriptApp.getOAuthToken()
    }
  }
}

function listGA4AccountSummaries() {
  return JSON.parse(UrlFetchApp.fetch(ga4BaseRequestUrl + 'accountSummaries', getOptions()).getContentText());
}

function listGA4Accounts() {
  return JSON.parse(UrlFetchApp.fetch(ga4BaseRequestUrl + 'accounts', getOptions()).getContentText());
}

function listGA4Properties(id, filterType) {
  let filter = '';
  if (filterType == 'account') {
    filter = 'parent:accounts/' + id;
  } else if (filterType == 'firebase') {
    filter = 'firebase_project:' + id;
  }
  return JSON.parse(UrlFetchApp.fetch(ga4BaseRequestUrl + 'properties?filter=' + filter, getOptions()).getContentText());
}

function listGA4AuditAccountUserLinks(accountName) {
  return JSON.parse(UrlFetchApp.fetch(ga4BaseRequestUrl + accountName + '/userLinks:audit', getOptions()).getContentText());
}

function listGA4AuditPropertyUserLinks(propertyName) {
  return JSON.parse(UrlFetchApp.fetch(ga4BaseRequestUrl + propertyName + '/userLinks:audit', getOptions()).getContentText());
}

function listGA4AndroidAppDataStreams(propertyName) {
  return JSON.parse(UrlFetchApp.fetch(ga4BaseRequestUrl + propertyName + '/androidAppDataStreams', getOptions()).getContentText());
}

function listGA4FirebaseLinks(propertyName) {
  return JSON.parse(UrlFetchApp.fetch(ga4BaseRequestUrl + propertyName + '/firebaseLinks', getOptions()).getContentText());
}

function listGA4GoogleAdsLinks(propertyName) {
  return JSON.parse(UrlFetchApp.fetch(ga4BaseRequestUrl + propertyName + '/googleAdsLinks', getOptions()).getContentText());
}

function listGA4iosAppDataStreams(propertyName) {
  return JSON.parse(UrlFetchApp.fetch(ga4BaseRequestUrl + propertyName + '/iosAppDataStreams', getOptions()).getContentText());
}

function listGA4WebStreams(propertyName) {
  return JSON.parse(UrlFetchApp.fetch(ga4BaseRequestUrl + propertyName + '/webDataStreams', getOptions()).getContentText());
}

function getEnhancedMeasurementSettings(webDataStreamName) {
  return JSON.parse(UrlFetchApp.fetch(ga4BaseRequestUrl + webDataStreamName + '/enhancedMeasurementSettings', getOptions()).getContentText());
}

function getGlobalSiteTag(webDataStreamName) {
  return JSON.parse(UrlFetchApp.fetch(ga4BaseRequestUrl + webDataStreamName + '/getGlobalSiteTag', getOptions()).getContentText());
}
