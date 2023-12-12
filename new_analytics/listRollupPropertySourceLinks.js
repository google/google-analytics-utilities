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
 * Retrieves the rollup property source links for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the rollup property source links.
 */
function listGA4RollupPropertySourceLinks(properties) {
  let sheetValuesArray = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const links = listGA4Entities(
      'rollupPropertySourceLinks', propertyName).rollupPropertySourceLinks;
     if (links != undefined) {
       links.forEach(link => {
        sheetValuesArray.push([
          property[0],
          property[1],
          property[2],
          property[3],
          link.sourceProperty,
          link.name
        ]);
      });
    }
  });
  return sheetValuesArray;
}

/**
 * Writes GA4 rollup property source links to a sheet.
 */
function writeGA4RollupPropertySourceLinksToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const rollupPropertySourceLinks = listGA4RollupPropertySourceLinks(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.rollupPropertySourceLinks);
  writeToSheet(rollupPropertySourceLinks, sheetsMeta.ga4.rollupPropertySourceLinks.sheetName);
}