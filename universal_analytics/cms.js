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
 * Retrieves the custom metrics for a given property.
 * @param {string|number} accountId
 * @param {string|number} propertyId
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the custom metrics for given
 * property.
 */
function listCustomMetrics(accountId, propertyId) {
  const cms = getCustomMetrics(accountId, propertyId);
  const finalizedCms = [];
  if (cms != undefined || cms.length != 0) {
    for (let i = 0; i < cms.length; i++) {
      finalizedCms.push([
        accountId,
        propertyId,
        cms[i].index,
        cms[i].name,
        cms[i].scope,
        cms[i].active,
        cms[i].min_value || '',
        cms[i].max_value || '',
        cms[i].type]);
    }                 
  }
  return finalizedCms;
}

/**
 * Writes custom metrics to the sheet.
 */
function writeCustomMetricsToSheet() {
  let customMetrics = [];
  const selectedProperties = getSelectedProperties(getSelectedViews());
  selectedProperties.forEach(summary => {
    const accountId = summary[1];
    const propertyId = summary[3];
    customMetrics = customMetrics.concat(listCustomMetrics(accountId, propertyId));
  });
  if (customMetrics != []) {
    writeToSheet(customMetrics, sheetsMeta.ua.customMetrics.sheetName);
  }
}

