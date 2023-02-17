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
 * Retrieves the SA360 links for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the SA360 links for the given
 * set of properties.
 */
function listGA4SA360Links(properties) {
  let sheetValuesArray = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const links = listGA4Entities(
      'searchAds360Links', propertyName).searchAds360Links;
    if (links != undefined) {
      sheetValuesArray = links.reduce((arr, resource) => {
        arr.push([
          property[0],
          property[1],
          property[2],
          property[3],
          resource.advertiserId,
          resource.name,
          resource.advertiserDisplayName,
          resource.campaignDataSharingEnabled,
          resource.costDataSharingEnabled,
          resource.siteStatsSharingEnabled
        ]);
        return arr;
      }, []);
    }
  });
  return sheetValuesArray;
}

/**
 * Writes GA4 SA360 link information to a sheet.
 */
function writeGA4SA360LinksToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const sa360Links = listGA4SA360Links(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.sa360Links);
  writeToSheet(sa360Links, sheetsMeta.ga4.sa360Links.sheetName);
}