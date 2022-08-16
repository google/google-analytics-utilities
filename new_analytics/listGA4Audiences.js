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
 * Retrieves the audiences for a given set of properties.
 * @param {!Array<!Array>} properties A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the audiences for given
 * property.
 */
function listSelectedGA4Audiences(properties) {
  const formattedAudiences = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const audiences = listGA4Entities(
      'audiences', propertyName).audiences;
    if (audiences != undefined) {
      for (let i = 0; i < audiences.length; i++) {
        let filterClauses = audiences[i].filterClauses;
        if (filterClauses != undefined) {
          filterClauses = filterClauses.toString();
        }
        formattedAudiences.push([
          property[0],
          property[1],
          property[2],
          property[3],
          audiences[i].displayName,
          audiences[i].name,
          audiences[i].description,
          audiences[i].membershipDurationDays,
          audiences[i].adsPersonalizationEnabled,
          audiences[i].eventTrigger.eventName,
          audiences[i].eventTrigger.logCondition,
          audiences[i].exclusionDurationMode,
          filterClauses
        ]);
      }
    }
  });
  return formattedAudiences;
}

/**
 * 
 */
function writeGA4AudiencesToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const audiences = listSelectedGA4Audiences(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.audiences);
  writeToSheet(audiences, sheetsMeta.ga4.audiences.sheetName);
}