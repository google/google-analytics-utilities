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
 * Retrieves the expanded data sets for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the expanded datasets for the given
 * set of properties.
 */
function listGA4ExpandedDataSets(properties) {
  let sheetValuesArray = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const dataSets = listGA4Entities(
      'expandedDataSets', propertyName).expandedDataSets;
    if (dataSets != undefined) {
      dataSets.forEach(dataSet => {
        let filterExpression = '';
        if (dataSet.dimensionFilterExpression) {
          filterExpression = dataSet.dimensionFilterExpression.toString();
        }
        sheetValuesArray.push([
          property[0],
          property[1],
          property[2],
          property[3],
          dataSet.displayName,
          dataSet.name,
          dataSet.description,
          dataSet.dimensionNames.join(', '),
          dataSet.metricNames.join(', '),
          filterExpression,
          dataSet.dataCollectionStartTime
        ]);
      });
    }
  });
  return sheetValuesArray;
}

/**
 * Writes GA4 expanded dataSet information to a sheet.
 */
function writeGA4ExpandedDataSetsToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const expandedDataSets = listGA4ExpandedDataSets(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.expandedDataSets);
  writeToSheet(expandedDataSets, sheetsMeta.ga4.expandedDataSets.sheetName);
}