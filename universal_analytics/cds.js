/**
 * Copyright 2021 Google LLC
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
 * Retrieves the custom dimensions for a given property.
 * @param {string|number} accountId
 * @param {string|number} propertyId
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the custom dimensions for given
 * property.
 */
function listCustomDimensions(accountId, propertyId) {
  var cds = getCustomDimensions(accountId, propertyId);
  var finalizedCds = [];
  for (var i = 0; i < cds.length; i++) {
    const tempArray = [
      accountId,
      propertyId,
      cds[i].index,
      cds[i].name,
      cds[i].scope,
      cds[i].active
    ];
    finalizedCds.push(tempArray);
  }
  return finalizedCds;
}

/**
 * Writes custom dimensions to the sheet.
 */
function writeCustomDimensionsToSheet() {
  let customDimensions = [];
  const selectedProperties = getSelectedProperties(getSelectedViews());
  selectedProperties.forEach(summary => {
    const accountId = summary[1];
    const propertyId = summary[3];
    customDimensions = customDimensions.concat(listCustomDimensions(accountId, propertyId));
  });
  if (customDimensions != []) {
    writeToSheet(customDimensions, sheetNames.ua.customDimensions);
  }
}

