/**
 * Copyright 2024 Google LLC
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
 * Retrieves the event edit rules for a given set of properties.
 * @param {!Array<!Array>} streams A two dimensional array of
 * account and stream names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the event edit rules for the given
 * set of properties.
 */
function listGA4EventEditRules(streams) {
  let sheetValuesArray = [];
  streams.forEach(stream => {
    const streamName = `properties/${stream[3]}/dataStreams/${stream[5]}`;
    const eventEditRules = listGA4Entities(
      'eventEditRules', streamName).eventEditRules;
    if (eventEditRules != undefined) {
      eventEditRules.forEach(rule => {
        sheetValuesArray.push([
          ...stream.slice(0, 6),
          rule.displayName,
          rule.name,
          rule.processingOrder,
          JSON.stringify(rule.eventConditions) || '[]',
          JSON.stringify(rule.parameterMutations) || '[]'
        ]);
      });
    }
  });
  return sheetValuesArray;
}

/**
 * Writes event edit rules to a sheet.
 */
function writeEventEditRulesToSheet() {
  const selectedStreams = getSelectedGa4DataStreams();
  const eventEditRules = listGA4EventEditRules(selectedStreams);
  clearSheetContent(sheetsMeta.ga4.eventEditRules);
  writeToSheet(eventEditRules, sheetsMeta.ga4.eventEditRules.sheetName);
}