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
 * Retrieves the custom dimensions for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the custom dimensions for given
 * property.
 */
function listSelectedGA4CustomDimensions(properties) {
  const finalizedCds = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const cds = listGA4CustomDimensions(propertyName).customDimensions;
    if (cds != undefined) {
      for (let i = 0; i < cds.length; i++) {
        finalizedCds.push([
          property[0],
          property[1],
          property[2],
          property[3],
          cds[i].displayName,
          cds[i].parameterName,
          cds[i].name,
          cds[i].scope,
          cds[i].disallowAdsPersonalization,
          cds[i].description
        ]);
      }
    }
  });
  return finalizedCds;
}

/**
 * 
 */
function writeGA4CustomDimensionsToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const cds = listSelectedGA4CustomDimensions(selectedProperties);
  if (cds.length > 0) {
    writeToSheet(cds, sheetNames.ga4.customDimensions);
  }
}