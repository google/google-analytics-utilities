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
 * 
 */
function listGA4UserLinks(properties) {
  const accounts = [];
  const formattedUserLinks = [];
  properties.forEach(property => {
    const accountName = 'accounts/' + property[1];
    const propertyName = 'properties/' + property[3];
    if (accounts.indexOf(accountName) == -1) {
      accounts.push(accountName);
      const accountUserLinks = listGA4Entities('accountUserLinks', accountName).userLinks;
      if (accountUserLinks) {
        accountUserLinks.forEach(userLink => {
          formattedUserLinks.push([
            property[0],
            property[1],
            '', '',
            userLink.emailAddress,
            userLink.name,
            'account',
            userLink.directRoles.join(', ')
          ]);
        });
      }
    }
    const propertyUserLinks = listGA4Entities('propertyUserLinks', propertyName).userLinks;
    if (propertyUserLinks) {
      propertyUserLinks.forEach(userLink => {
        formattedUserLinks.push([
          property[0],
          property[1],
          property[2],
          property[3],
          userLink.emailAddress,
          userLink.name,
          'property',
          userLink.directRoles.join(', ')
        ]);
      });
    }
  });
  return formattedUserLinks;
}

/**
 * 
 */
function writeGA4UserLinksToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const userLinks = listGA4UserLinks(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.userLinks);
  writeToSheet(userLinks, sheetsMeta.ga4.userLinks.sheetName);
}