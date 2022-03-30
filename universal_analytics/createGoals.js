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
 * Retrieves the goal settings from the sheet.
 * @return {!Array<!Object>} An array of objects were the detail
 * field is an array of goal settings and the rowNumber field is the
 * original row number of the goal settings.
 */
function getGoalSettings() {
  const allGoalSettings = getDataFromSheet(sheetsMeta.ua.goals.sheetName);
  return allGoalSettings.reduce((filtered, goalDetails, index) => {
    if (goalDetails[22]) {
      filtered.push({
        rowNumber: index + 2,
        details: goalDetails
      });
    }
    return filtered;
  }, []);
}

/**
 * The request for a goal to be created.
 * @param {!Array<!Array>} requestDetails The request information.
 * @return {!Object} The boilerplate request information that does
 * not include the actual settings for a goal.
 */
function createBaseRequest(requestDetails) {
  let baseRequest = {
    accountId: requestDetails[0],
    webPropertyId: requestDetails[1],
    profileId: requestDetails[2],
    resource: {
      name: requestDetails[3],
      id: requestDetails[4],
      active: requestDetails[5],
      type: requestDetails[6]
    }
  }
  return baseRequest;
}

/**
 * Adds the goals settings to a goal creation request.
 * @param {!Array<!Array>} requestDetails The request information.
 * @return {!Object} The complete request to create a goal
 * including the goal settings.
 */
function createGoalRequest(requestDetails) {
  let request = createBaseRequest(requestDetails);
  const type = requestDetails[6];
  if (type == 'URL_DESTINATION') {
    request.resource.urlDestinationDetails = {
      'matchType': requestDetails[7],
      'url': requestDetails[8],
      'caseSensitive': requestDetails[9]
    }
    return request;
  } else if (type == 'EVENT') {
    request.resource.eventDetails = {
      eventConditions: [],
      useEventValue: requestDetails[16] || true
    }
    if (requestDetails[10].length > 0 && requestDetails[11].length > 0) {
      request.resource.eventDetails.eventConditions.push({
        type: 'CATEGORY',
        matchType: requestDetails[10],
        expression: requestDetails[11]
      });
    }
    if (requestDetails[12].length > 0 && requestDetails[13].length > 0) {
      request.resource.eventDetails.eventConditions.push({
        type: 'ACTION',
        matchType: requestDetails[12],
        expression: requestDetails[13]
      });
    }
    if (requestDetails[14].length > 0 && requestDetails[15].length > 0) {
      request.resource.eventDetails.eventConditions.push({
        type: 'LABEL',
        matchType: requestDetails[14],
        expression: requestDetails[15]
      });
    }
    return request;
  } else if (type == 'VISIT_TIME_ON_SITE') {
    request.resource.visitTimeOnSiteDetails = {
      comparisonType: requestDetails[17],
      comparisonValue: requestDetails[18]
    }
    return request;
  } else if (type == 'VISIT_NUM_PAGES') {
    request.resource.visitNumPagesDetails = {
      comparisonType: requestDetails[19],
      comparisonValue: requestDetails[20]
    }
    return request;
  }
  return request;
}

/**
 * Writes the status of a goal's creation to column X
 * in the sheet.
 * @param {string} id The ID number of the created goal.
 * @param {number} rowNumber The row that is being written to.
 */
function writeStatus(id, rowNumber) {
  const range = 'X' + rowNumber;
  if (id > 0 && id <= 20) {
    sheet.getRange(range).setValue('Goal Created');
  } else {
    sheet.getRange(range).setValue('Error');
  }
}

/**
 * Create selected goals in a view.
 */
function createGoals() {
  const goalSettings = getGoalSettings();
  goalSettings.forEach(goalSetting => {
    const goalRequest = createGoalRequest(goalSetting.details);
    const id = createGoal(goalRequest);
    writeStatus(id, goalSetting.rowNumber);
    Utilities.sleep(1000);
  });
}