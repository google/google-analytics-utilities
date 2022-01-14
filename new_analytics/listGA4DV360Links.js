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
 * Retrieves the Google DV360 links for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the Google DV360 Links for the given
 * set of properties.
 */
function listSelectedDV360Links(properties) {
  const links = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const allDV360Links = listGA4Entities(
      'displayVideo360AdvertiserLinks', propertyName)
      .displayVideo360AdvertiserLinks;
    if (allDV360Links != undefined) {
      for (let i = 0; i < allDV360Links.length; i++) {
        links.push([
          property[0],
          property[1],
          property[2],
          property[3],
          allDV360Links[i].advertiserId,
          allDV360Links[i].name,
          allDV360Links[i].advertiserDisplayName,
          allDV360Links[i].adsPersonalizationEnabled,
          allDV360Links[i].campaignDataSharingEnabled,
          allDV360Links[i].costDataSharingEnabled
        ]);
      }
    }
  });
  return links;
}

/**
 * 
 */
function writeGA4DV360LinksToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const links = listSelectedDV360Links(selectedProperties);
  if (links.length > 0) {
    writeToSheet(links, sheetNames.ga4.displayVideo360AdvertiserLinks);
  }
}