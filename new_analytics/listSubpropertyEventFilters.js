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
 * Retrieves the subproperty event filters for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the subproperty event filters.
 */
function listGA4SubpropertyEventFilters(properties) {
  let sheetValuesArray = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const eventFilters = listGA4Entities(
      'subpropertyEventFilters', propertyName).subpropertyEventFilters;
     if (eventFilters != undefined) {
       eventFilters.forEach(eventFilter => {
        sheetValuesArray.push([
          property[0],
          property[1],
          property[2],
          property[3],
          eventFilter.applyToProperty,
          eventFilter.name,
          JSON.stringify(eventFilter.filterClauses)
        ]);
      });
    }
  });
  return sheetValuesArray;
}

/**
 * Writes GA4 subproperty event filters to a sheet.
 */
function writeGA4SubpropertyEventFiltersToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const subpropertyEventFilters = listGA4SubpropertyEventFilters(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.subpropertyEventFilters);
  writeToSheet(subpropertyEventFilters, sheetsMeta.ga4.subpropertyEventFilters.sheetName);
}