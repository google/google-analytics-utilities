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
 * Generates the full list of audiences in a property.
 * @param {string|number} accountId
 * @param {string|number} propertyId
 * @param {string|number} startIndex
 * @param {!Array<!Array>} audienceList An array of audiences.
 * @return {!Array<!Array>} The full list of audiences for a given property.
 */
function listAudiences(accountId, propertyId, startIndex, audienceList) {
  var response = listRemarketingAudiences(accountId, propertyId, startIndex);
  var formattedAudiences = formatAudiences(response.items);
  audienceList = audienceList.concat(formattedAudiences);
  if (response.totalResults > (startIndex + 1000)) {
    Utilities.sleep(300);
    return listAudiences(accountId, propertyId, startIndex + 1000, audienceList);
  } else {
    return audienceList;
  }
}

/**
 * Formats an audiences list into a two dimensional array that can be written
 * to the sheet.
 * @param {!Array<!Array>} audiences The array of audiences that have not
 * yet been formatted to be written to the sheet.
 * @return {!Array<!Array>}
 */
function formatAudiences(audiences) {
  var finalAudiences = [];
  for (var audienceIndex = 0; audienceIndex < audiences.length; audienceIndex++) {
    var currentAudience = audiences[audienceIndex];
    var audience = [
      currentAudience.name,
      currentAudience.id,
      currentAudience.accountId,
      currentAudience.webPropertyId,
      currentAudience.created,
      currentAudience.updated,
      currentAudience.linkedViews,
      currentAudience.audienceType
    ]
    if (currentAudience.audienceType == 'SIMPLE') {
      audience = audience.concat([
        '' || currentAudience.audienceDefinition.includeConditions.isSmartList,
        '' || currentAudience.audienceDefinition.includeConditions.segment,
        '' || currentAudience.audienceDefinition.includeConditions.membershipDurationDays,
        '' || currentAudience.audienceDefinition.includeConditions.daysToLookBack,
        '', ''
      ])
    } else {
      if (currentAudience.stateBasedAudienceDefinition.includeConditions) {
        audience = audience.concat([
          '' || currentAudience.stateBasedAudienceDefinition.includeConditions.isSmartList,
          '' || currentAudience.stateBasedAudienceDefinition.includeConditions.segment,
          '' || currentAudience.stateBasedAudienceDefinition.includeConditions.membershipDurationDays,
          '' || currentAudience.stateBasedAudienceDefinition.includeConditions.daysToLookBack
        ]);
      } else {
        audience = audience.concat([ '', '', '', '']);
      }
      if (currentAudience.stateBasedAudienceDefinition.excludeConditions) {
        audience = audience.concat([
          '' || currentAudience.stateBasedAudienceDefinition.excludeConditions.segment,
          '' || currentAudience.stateBasedAudienceDefinition.excludeConditions.exclusionDuration
        ])
      } else {
        audience = audience.concat(['',''])
      }
    }
    var laa = currentAudience.linkedAdAccounts[0];
    audience = audience.concat([
      '' || laa.linkedAccountId,
      '' || laa.type,
      '' || laa.status,
      '' || laa.eligibleForSearch
    ])
    finalAudiences.push(audience);
  }
  return finalAudiences;
}

/**
 * Writes audiences to the sheet.
 */
function writeAudiencesToSheet() {
  let audiences = [];
  const selectedProperties = getSelectedProperties(getSelectedViews());
  selectedProperties.forEach(summary => {
    const accountId = summary[1];
    const propertyId = summary[3];
    audiences = audiences.concat(listAudiences(accountId, propertyId, 1, []));
  });
  if (audiences != []) {
    writeToSheet(audiences, sheetNames.ua.audiences);
  }
}