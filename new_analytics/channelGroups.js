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
 * Retrieves the channel groups for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the channel groups for the given
 * set of properties.
 */
function listGA4ChannelGroups(properties) {
  let sheetValuesArray = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const channelGroups = listGA4Entities(
      'channelGroups', propertyName).channelGroups;
    if (channelGroups != undefined) {
      channelGroups.forEach(group => {
        sheetValuesArray.push([
          property[0],
          property[1],
          property[2],
          property[3],
          group.displayName || 'Default Channel Group',
          group.name,
          group.description,
          group.systemDefined,
          JSON.stringify(group.groupingRule) || '[]'
        ]);
      });
    }
  });
  return sheetValuesArray;
}

/**
 * Writes GA4 channel groups information to a sheet.
 */
function writeGA4ChannelGroupsToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const channelGroups = listGA4ChannelGroups(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.channelGroups);
  writeToSheet(channelGroups, sheetsMeta.ga4.channelGroups.sheetName);
}