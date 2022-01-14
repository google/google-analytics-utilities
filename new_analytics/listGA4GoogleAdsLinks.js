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
 * Retrieves the Google Ads links for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the Google Ads Links for the given
 * set of properties.
 */
function listSelectedGA4AdsLinks(properties) {
  const allAdsLinks = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const adsLinks = listGA4Entities(
      'googleAdsLinks', propertyName).googleAdsLinks;
    if (adsLinks != undefined) {
      for (let i = 0; i < adsLinks.length; i++) {
        allAdsLinks.push([
          property[0],
          property[1],
          property[2],
          property[3],
          adsLinks[i].customerId,
          adsLinks[i].name,
          adsLinks[i].canManageClients,
          adsLinks[i].adsPersonalizationEnabled,
          adsLinks[i].emailAddress,
          adsLinks[i].createTime,
          adsLinks[i].updateTime
        ]);
      }
    }
  });
  return allAdsLinks;
}

/**
 * 
 */
function writeGA4AdsLinksToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const adsLinks = listSelectedGA4AdsLinks(selectedProperties);
  if (adsLinks.length > 0) {
    writeToSheet(adsLinks, sheetNames.ga4.googleAdsLinks);
  }
}