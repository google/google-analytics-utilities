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
 * Retrieves the key events for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the key events for the given
 * set of properties.
 */
function listSelectedGA4KeyEvents(properties) {
  const allKeyEvents = [];
  const request = generateGA4DataReportRequest(
    ['eventName', 'isKeyEvent'],
    ['keyEvents'], '7daysAgo', 'today', 
    {name: 'isKeyEvent', matchType: 'EXACT', value: 'true'});
  properties.forEach(property => {
    const propertyId = property[3];
    const propertyName = 'properties/' + propertyId;
    const keyEvents = listGA4Entities(
      'keyEvents', propertyName).keyEvents;
    if (keyEvents) {
      let keyEventsReportResponse = {};
      let hasAccess = false;
      const noAccessText = 'No Access';
      try {
        keyEventsReportResponse = AnalyticsData.Properties.runReport(
          request, propertyName);
        hasAccess = true;
      } catch(e) {
      }
      for (let i = 0; i < keyEvents.length; i++) {
        const currentKeyEvent = keyEvents[i];
        let keyEventCount = 0;
        if (hasAccess) {
          keyEventCount = getkeyEventCount(
            keyEventsReportResponse, currentKeyEvent);
        }
        allKeyEvents.push([
          ...property.slice(0, 4),
          currentKeyEvent.eventName,
          currentKeyEvent.name,
          currentKeyEvent.createTime,
          currentKeyEvent.deletable,
          currentKeyEvent.custom,
          hasAccess ? keyEventCount : noAccessText,
          currentKeyEvent.countingMethod,
          currentKeyEvent.defaultValue
        ]);
      }
    }
  });
  return allKeyEvents;
}

/**
 * Retrieves either the key event count for a given event or zero.
 * @param {!Object} keyEventsReport Analytics report object.
 * @param {!Object} keyEvent
 * @return {number} keyEventCount The number of key events for a given event.
 */
function getkeyEventCount(keyEventsReport, keyEvent) {
  let keyEventCount = 0;
  if (keyEventsReport.rows) {
    keyEventRow = keyEventsReport.rows.find(
      row => row.dimensionValues[0].value == keyEvent.eventName);
    if (keyEventRow) {
      keyEventCount = keyEventRow.metricValues[0].value || 0;
    }
  }
  return keyEventCount;
}

/**
 * 
 */
function writeGA4KeyEventsToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const keyEvents = listSelectedGA4KeyEvents(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.keyEvents);
  writeToSheet(keyEvents, sheetsMeta.ga4.keyEvents.sheetName);
}