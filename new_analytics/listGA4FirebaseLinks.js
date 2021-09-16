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
 * Retrieves the Firebase links for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the Firebase links for the given
 * set of properties.
 */
function listSelectedGA4FirebaseLinks(properties) {
  const allFirebaseLinks = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const firebaseLinks = listGA4Entities(
      propertyName + ga4RequestSuffix.firebaseLinks
    ).firebaseLinks;
    if (firebaseLinks != undefined) {
      for (let i = 0; i < firebaseLinks.length; i++) {
        allFirebaseLinks.push([
          property[0],
          property[1],
          property[2],
          property[3],
          firebaseLinks[i].project,
          firebaseLinks[i].name,
          firebaseLinks[i].createTime,
          firebaseLinks[i].maximumUserAccess
        ]);
      }
    }
  });
  return allFirebaseLinks;
}

/**
 * 
 */
function writeGA4FirebaseLinksToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const firebaseLinks = listSelectedGA4FirebaseLinks(selectedProperties);
  if (firebaseLinks.length > 0) {
    writeToSheet(firebaseLinks, sheetNames.ga4.firebaseLinks);
  }
}