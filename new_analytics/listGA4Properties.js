/**
 * Copyright 2023 Google LLC
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
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * inner array contains metadata for a given property.
 */
function listSelectedGA4Properties(selectedProperties) {  
  let data = [];
  const request = generateGA4DataReportRequest([], ['eventCount'], '7daysAgo', 'today', {});
  const alreadyListedAccounts = [];
  let subpropertyFilters = [];
  selectedProperties.forEach(property => {
    if (alreadyListedAccounts.indexOf(property[1]) == -1) {
      alreadyListedAccounts.push(property[1]);
      const parent = {filter: 'ancestor:accounts/' + property[1], pageSize: 200};
      const properties = listGA4Entities('properties', parent).properties;
      if (properties) {
        data = data.concat(properties.reduce((arr, prop) => {
          if (selectedProperties.filter(property => property[3] == prop.name.split('/')[1]).length > 0) {
            const attributionSettings = getGA4Resource(
              'attributionSettings', prop.name + '/attributionSettings');
            const dataRetentionSettings = getGA4Resource(
              'dataRetentionSettings', prop.name + '/dataRetentionSettings');
            const googleSignalsSettings = getGA4Resource(
              'googleSignalsSettings', prop.name + '/googleSignalsSettings');
            let eventCount = 0;
            let eventRows = null;
            let sourceProperties = '';
            let subpropertyFilter = '';
            let subpropertyParent = '';
            try {
              eventRows = AnalyticsData.Properties.runReport(
                request, prop.name).rows;
            } catch(e) {
              eventCount = 'No Access';
            }
            if (eventRows) {
              eventCount = eventRows[0].metricValues[0].value;
            }
            if (prop.propertyType == 'PROPERTY_TYPE_ROLLUP') {
              sourceProperties = listGA4Entities(
                'rollupPropertySourceLinks', prop.name).rollupPropertySourceLinks;
              sourceProperties = sourceProperties.reduce((linkArray, link) => {
                linkArray.push(link.sourceProperty);
                return linkArray;
              }, []).join(',');
            } else if (prop.propertyType == 'PROPERTY_TYPE_SUBPROPERTY') {
              if (prop.parent != subpropertyParent) {
                subpropertyParent = prop.parent;
                subpropertyFilters = listGA4Entities(
                  'subpropertyEventFilters', subpropertyParent).subpropertyEventFilters;
              }
              subpropertyFilter = subpropertyFilters.find(
                filter => prop.name == filter.applyToProperty);
              if (subpropertyFilter != undefined && subpropertyFilter != '') {
                subpropertyFilter = JSON.stringify(subpropertyFilter);
              }
            }
            const subArray = [
              property[0],
              property[1],
              prop.displayName,
              prop.name.split('/')[1],
              prop.propertyType,
              prop.parent,
              sourceProperties,
              subpropertyFilter,
              prop.createTime,
              prop.updateTime,
              prop.industryCategory,
              prop.timeZone,
              prop.currencyCode,
              prop.serviceLevel,
              eventCount,
              googleSignalsSettings.state,
              dataRetentionSettings.eventDataRetention,
              dataRetentionSettings.resetUserDataOnNewActivity || false,
              attributionSettings.acquisitionConversionEventLookbackWindow,
              attributionSettings.otherConversionEventLookbackWindow,
              attributionSettings.reportingAttributionModel
            ]
            arr.push(subArray);
            return arr;
          }
          return arr;
        }, []));
      }
    }
  });
  return data;
}

/**
 * 
 */
function writeGA4PropertyDetailsToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const properties = listSelectedGA4Properties(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.properties);
  writeToSheet(properties, sheetsMeta.ga4.properties.sheetName);
}