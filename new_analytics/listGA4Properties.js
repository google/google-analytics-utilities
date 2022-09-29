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

/**
 * Retrieves the property details for a given set of accounts.
 * @param {!Array<!Array>} account A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * inner array contains metadata for a given property.
 */
function listSelectedGA4Properties(accounts) {
  let data = [];
  accounts.forEach(property => {
    const parent = {filter: 'parent:accounts/' + property[1], pageSize: 200};
    const properties = listGA4Entities('properties', parent).properties;
    data = data.concat(properties.reduce((arr, prop) => {
      const attributionSettings = AnalyticsAdmin.Properties.getAttributionSettings(prop.name + '/attributionSettings');
      const subArray = [
        property[0],
        property[1],
        prop.displayName,
        prop.name.split('/')[1],
        prop.createTime,
        prop.updateTime,
        prop.industryCategory,
        prop.timeZone,
        prop.currencyCode,
        prop.serviceLevel,
        AnalyticsAdmin.Properties.getDataRetentionSettings(prop.name + '/googleSignalsSettings').state,
        AnalyticsAdmin.Properties.getGoogleSignalsSettings(prop.name + '/dataRetentionSettings').eventDataRetention,
        attributionSettings.acquisitionConversionEventLookbackWindow,
        attributionSettings.otherConversionEventLookbackWindow,
        attributionSettings.reportingAttributionModel
      ]
      arr.push(subArray);
      return arr;
    }, []));
  });
  return data;
}

/**
 * 
 */
function writeGA4PropertyDetailsToSheet() {
  const selectedAccounts = getSelectedGa4Properties();
  const properties = listSelectedGA4Properties(selectedAccounts);
  clearSheetContent(sheetsMeta.ga4.properties);
  writeToSheet(properties, sheetsMeta.ga4.properties.sheetName);
}