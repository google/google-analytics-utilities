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
 * Retrieves the custom metrics for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the custom metrics for the given
 * set of properties.
 */
function listSelectedGA4CustomMetrics(properties) {
  const finalizedCms = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const cms = listGA4Entities(
      'customMetrics', propertyName).customMetrics;
    if (cms != undefined) {
      for (let i = 0; i < cms.length; i++) {
        let rmt = '';
        if (cms[i].restrictedMetricType) {
          rmt = cms[i].restrictedMetricType.join(', ')
        }
        finalizedCms.push([
          property[0],
          property[1],
          property[2],
          property[3],
          cms[i].displayName,
          cms[i].name,
          cms[i].parameterName,
          cms[i].scope,
          cms[i].measurementUnit,
          cms[i].description,
          rmt
        ]);
      }
    }
  });
  return finalizedCms;
}

/**
 * 
 */
function writeGA4CustomMetricsToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const cms = listSelectedGA4CustomMetrics(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.customMetrics);
  writeToSheet(cms, sheetsMeta.ga4.customMetrics.sheetName);
}