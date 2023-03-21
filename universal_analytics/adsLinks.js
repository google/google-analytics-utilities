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
 * Generates an array of Google Ads links for a property.
 * @param {string|number} accountId
 * @param {string|number} propertyId
 * @param {!Array<!Array>} linkList An array of Google Ads links.
 * @return {!Array<!Array>} The Google Ads links for a given property.
 */
function listUAAdsLinks(accountId, propertyId, linkList) {
  const links = Analytics.Management.WebPropertyAdWordsLinks.list(
    accountId, propertyId).items;
  if (links.length > 0) {
    const formattedLinks = links.reduce((arr, link) => {
    arr.push([
        link.entity.webPropertyRef.accountId,
        link.entity.webPropertyRef.name,
        link.entity.webPropertyRef.id,
        link.name,
        link.adWordsAccounts[0].customerId.replace(/-/g, ''),
        link.adWordsAccounts[0].autoTaggingEnabled || false,
        link.profileIds.join(', ')
      ]);
      return arr;
    }, []);
    linkList = linkList.concat(formattedLinks);
    Utilities.sleep(300);
  }
  return linkList;
}

/**
 * Writes UA Google Ads Links to the sheet.
 */
function writeUAAdsLinksToSheet() {
  let links = [];
  const selectedProperties = getSelectedProperties(getSelectedViews());
  selectedProperties.forEach(summary => {
    const accountId = summary[1];
    const propertyId = summary[3];
    links = links.concat(listUAAdsLinks(accountId, propertyId, []));
  });
  if (links.length > 0) {
    writeToSheet(links, sheetsMeta.ua.adsLinks.sheetName);
  }
}