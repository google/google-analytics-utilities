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
 * Retrieves the conversion events for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the conversion events for the given
 * set of properties.
 */
function listSelectedGA4ConversionEvents(properties) {
  const allConversionEvents = [];
  const request = generateGA4DataReportRequest(
    ['eventName', 'isConversionEvent'],
    ['conversions'], '7daysAgo', 'today', 
    {name: 'isConversionEvent', matchType: 'EXACT', value: 'true'});
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const conversionEvents = listGA4Entities(
      'conversionEvents', propertyName).conversionEvents;
    if (conversionEvents != undefined) {
      for (let i = 0; i < conversionEvents.length; i++) {
        const currentConversionEvent = conversionEvents[i];
        allConversionEvents.push([
          property[0],
          property[1],
          property[2],
          property[3],
          currentConversionEvent.eventName,
          currentConversionEvent.name,
          currentConversionEvent.createTime,
          currentConversionEvent.deletable,
          currentConversionEvent.custom,
          getConversionCount(request, currentConversionEvent, 'properties/' + property[3])
        ]);
      }
    }
  });
  return allConversionEvents;
}

/**
 * Retrieves either the conversion count for a given event or zero.
 * @param {!Object} request Analytics report request object.
 * @param {!Object} conversionEvent
 * @param {string} propertyName The proprty name.
 * @return {number} conversionCount The number of conversions for a given event.
 */
function getConversionCount(request, conversionEvent, propertyName) {
  let conversionCount = 0;
  const conversions = AnalyticsData.Properties.runReport(request, propertyName);
  if (conversions.rows) {
    conversionRow = conversions.rows.find(row => row.dimensionValues[0].value == conversionEvent.eventName);
    if (conversionRow) {
      conversionCount = conversionRow.metricValues[0].value || 0;
    }
  }
  return conversionCount;
}

/**
 * 
 */
function writeGA4ConversionEventsToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const conversionEvents = listSelectedGA4ConversionEvents(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.conversionEvents);
  writeToSheet(conversionEvents, sheetsMeta.ga4.conversionEvents.sheetName);
}