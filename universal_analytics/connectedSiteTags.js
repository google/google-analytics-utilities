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
 * Lists all of the connected site tags for a set of properties.
 * @param {!Array<Array>} properties A double array of properties.
 * @return {!Array<Arra>} A double array of connected site tags data.
 */
function listSelectedPropertyConnectedSiteTags(properties) {
  const formatedData = [];
  for (let i = 0; i < properties.length; i++) {
    const currentProperty = properties[i];
    const internalPropertyId = currentProperty[4];
    const siteTagSettings = listGA4Entities(
      'connectedSiteTags',
      {property: `properties/${internalPropertyId}`}).connectedSiteTags || [];
    for (
      let siteTagIndex = 0; 
      siteTagIndex < siteTagSettings.length; 
      siteTagIndex++
    ) {
      const currentSiteTag = siteTagSettings[siteTagIndex];
      formatedData.push([
        currentProperty[0],
        currentProperty[1],
        currentProperty[2],
        currentProperty[3],
        currentProperty[4],
        currentSiteTag.displayName,
        currentSiteTag.tagId
      ]);
    }
  }
  return formatedData;
}

/**
 * Writes UA properties to the connected site tag sheet.
 */
function writeUAConnectedSiteTagDataToSheet() {
  const accountSummariesData = getDataFromSheet(
    sheetsMeta.ua.accountSummaries.sheetName);
  const views = accountSummariesData.filter(arr => arr[arr.length -1]);
  const selectedProperties = [];
  for (let i = 0; i < views.length; i++) {
    const internalPropertyId = views[4];
    if (!selectedProperties
        .filter(prop => prop[4] == internalPropertyId).length) {
      selectedProperties.push(views[i]); 
    }
  }
  const siteTagSettings = listSelectedPropertyConnectedSiteTags(
    selectedProperties);
  clearSheetContent(sheetsMeta.ga4.connectedSiteTags);
  writeToSheet(siteTagSettings, sheetsMeta.ga4.connectedSiteTags.sheetName);
}