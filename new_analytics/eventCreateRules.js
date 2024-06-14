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
 * Retrieves the event create rules for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the event create rules for the given
 * set of properties.
 */
function listGA4EventCreateRules(streams) {
  let sheetValuesArray = [];
  streams.forEach(stream => {
    const streamName = `properties/${stream[3]}/dataStreams/${stream[5]}`;
    const eventCreateRules = listGA4Entities(
      'eventCreateRules', streamName).eventCreateRules;
    if (eventCreateRules != undefined) {
      eventCreateRules.forEach(rule => {
        sheetValuesArray.push([
          ...stream.slice(0, 6),
          rule.destinationEvent,
          rule.name,
          rule.sourceCopyParameters,
          JSON.stringify(rule.eventConditions) || '[]',
          JSON.stringify(rule.parameterMutations) || '[]'
        ]);
      });
    }
  });
  return sheetValuesArray;
}

/**
 * Writes GA4 event create rules to a sheet.
 */
function writeGA4EventCreateRulesToSheet() {
  const selectedStreams = getSelectedGa4DataStreams();
  const mps = listGA4EventCreateRules(selectedStreams);
  clearSheetContent(sheetsMeta.ga4.eventCreateRules);
  writeToSheet(mps, sheetsMeta.ga4.eventCreateRules.sheetName);
}