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
 * Retrieves the calculated metrics for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the calculated metrics for the given property.
 */
function listSelectedGA4CalculatedMetrics(properties) {
  const finalizedCalcMetrics = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const calcMetrics = listGA4Entities(
      'calculatedMetrics', propertyName).calculatedMetrics;
    if (calcMetrics != undefined) {
      for (let i = 0; i < calcMetrics.length; i++) {
        let rmt = '';
        if (calcMetrics[i].restrictedMetricType) {
          rmt = calcMetrics[i].restrictedMetricType.join(', ');
        }
        finalizedCalcMetrics.push([
          property[0],
          property[1],
          property[2],
          property[3],
          calcMetrics[i].displayName,
          calcMetrics[i].name,
          calcMetrics[i].description,
          calcMetrics[i].calculatedMetricId,
          calcMetrics[i].metricUnit,
          rmt,
          calcMetrics[i].formula,
          calcMetrics[i].invalidMetricReference
        ]);
      }
    }
  });
  return finalizedCalcMetrics;
}

/**
 * Retrieves the calculated metrics for the selected properties and writes them
 * to the calculated metrics sheet.
 */
function writeGA4CalculatedMetricsToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const calcMetrics = listSelectedGA4CalculatedMetrics(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.calculatedMetrics);
  writeToSheet(calcMetrics, sheetsMeta.ga4.calculatedMetrics.sheetName);
}