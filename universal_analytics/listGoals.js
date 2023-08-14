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
 * Lists all of the goals for a given view.
 * @param {string|number} accountId
 * @param {string|number} propertyId
 * @param {string|number} viewId
 * @return {!Array<!Array>} An array of goals for a given view.
 */
function listExistingGoals(accountId, propertyId, viewId) {
  var goalList = [];
  var goals = listGoals(accountId, propertyId, viewId);
  if (goals !== null) {
    for (var j = 0; j < goals.length; j++) {
      var currentGoal = goals[j];
      var type = currentGoal.type;
      var tempArray = [
        accountId,
        propertyId,
        viewId,
        currentGoal.name,
        currentGoal.id,
        currentGoal.active,
        type
      ];
      if (type == 'URL_DESTINATION') {
        let steps = '';
        if (currentGoal.urlDestinationDetails.steps) {
        steps = JSON.stringify(currentGoal.urlDestinationDetails.steps);
        /*
          steps = currentGoal.urlDestinationDetails.steps.reduce((arr, step) => 
          {
            arr.push(JSON.parse(step));
            return arr;
          }, []);
        */
        }
        var destinationArray = [currentGoal.urlDestinationDetails.matchType,
                                currentGoal.urlDestinationDetails.firstStepRequired,
                                steps,
                                currentGoal.urlDestinationDetails.url,
                                currentGoal.urlDestinationDetails.caseSensitive,
                                '','','','','','','','','','',''];
        tempArray = tempArray.concat(destinationArray);
      } else if (type == 'EVENT') {
        var eventArray = ['', '', '', '', '', '',
                          '', '', '', '','',currentGoal.eventDetails.useEventValue, '', '', '', ''];
        for (var k = 0; k < currentGoal.eventDetails.eventConditions.length; k++) {
          if (currentGoal.eventDetails.eventConditions[k].type == 'CATEGORY') {
            eventArray[5] = currentGoal.eventDetails.eventConditions[k].matchType;
            eventArray[6] = currentGoal.eventDetails.eventConditions[k].expression;
          } else if (currentGoal.eventDetails.eventConditions[k].type == 'ACTION') {
            eventArray[7] = currentGoal.eventDetails.eventConditions[k].matchType;
            eventArray[8] = currentGoal.eventDetails.eventConditions[k].expression;
          } else if (currentGoal.eventDetails.eventConditions[k].type == 'LABEL') {
            eventArray[9] = currentGoal.eventDetails.eventConditions[k].matchType;
            eventArray[10] = currentGoal.eventDetails.eventConditions[k].expression;
          }
        }
        tempArray = tempArray.concat(eventArray);
      } else if (type == 'VISIT_TIME_ON_SITE') {
        var timeOnSite = ['','','','','','', '', '', '','', '', '',
                          currentGoal.visitTimeOnSiteDetails.comparisonType,
                          currentGoal.visitTimeOnSiteDetails.comparisonValue,
                          '',''];
        tempArray = tempArray.concat(timeOnSite);
      } else if (type == 'VISIT_NUM_PAGES') {
        var numOfPages = ['','','','','','', '', '','','','','', '', '',
                          currentGoal.visitNumPagesDetails.comparisonType,
                          currentGoal.visitNumPagesDetails.comparisonValue];
        tempArray = tempArray.concat(numOfPages);
      }
      tempArray.push(currentGoal.value);
      goalList.push(tempArray);
    }
  }
  return goalList;
}

/**
 * Write goals to the sheet.
 */
function writeGoalsToSheet() {
  const selectedViews = getSelectedViews();
  let goalData = [];
  selectedViews.forEach(summary => {
    const accountId = summary[1];
    const propertyId = summary[3];
    const viewId = summary[5];
    goalData = goalData.concat(listExistingGoals(accountId, propertyId, viewId));
  });
  writeToSheet(goalData, sheetsMeta.ua.goals.sheetName);
  resizeRowHeights(sheetsMeta.ua.goals.sheetName, 21);
}