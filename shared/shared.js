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

const ss = SpreadsheetApp.getActive();

/**
 * Returns a list of Universal Analytics view details.
 * @param {string|number} accountId The GA account ID.
 * @param {string} propertyId The UA property ID.
 * @return {!Array} An array of UA view details.
 */
function getViewDetails(accountId, propertyId) {
  return Analytics.Management.Profiles.list(accountId, propertyId).items;
}

/**
 * Returns a list of Universal Analytics view custom dimensions.
 * @param {string|number} accountId The GA account ID.
 * @param {string} propertyId The UA property ID.
 * @return {!Array} An array of custom dimensions.
 */
function getCustomDimensions(accountId, propertyId) {
  return Analytics.Management.CustomDimensions.list(accountId, propertyId)
      .items;
}

/**
 * Creates a Universal Analytics custom dimension.
 * @param {!Object} request The request data to create a custom dimension.
 * @return {!Object} An object describing the custom dimension that was created.
 */
function createCustomDimension(request) {
  return Analytics.Management.CustomDimensions.insert(
      request.body, request.accountId, request.propertyId);
}

/**
 * Updates a Universal Analytics custom dimension.
 * @param {!Object} request The request data to update a custom dimension.
 * @return {!Object} An object describing the custom dimension that was updated.
 */
function updateCustomDimension(request) {
  return Analytics.Management.CustomDimensions.update(
      request.body, request.accountId, request.propertyId,
      'ga:dimension' + request.index);
}

/**
 * Creates a Universal Analytics custom metric.
 * @param {!Object} request The request data to create a custom metric.
 * @return {!Object} An object describing the custom metric that was created.
 */
function createCustomMetric(request) {
  return Analytics.Management.CustomMetrics.insert(
      request.body, request.accountId, request.propertyId);
}

/**
 * Updates a Universal Analytics custom metric.
 * @param {!Object} request The request data to update a custom metric.
 * @return {!Object} An object describing the custom metric that was updated.
 */
function updateCustomMetric(request) {
  return Analytics.Management.CustomMetrics.update(
      request.body, request.accountId, request.propertyId,
      'ga:metric' + request.index);
}

/**
 * Lists the custom metrics in a Universal Analytics property.
 * @param {string|number} accountId The GA account ID.
 * @param {string} propertyId The UA property ID.
 * @return {!Array} An array of custom metrics.
 */
function getCustomMetrics(accountId, propertyId) {
  return Analytics.Management.CustomMetrics.list(accountId, propertyId).items;
}

/**
 * Lists all of the Universal Analytics filters for a GA account.
 * @param {string|number} accountId The GA account ID.
 * @return {!Array} An array of UA filters.
 */
function getAllFilters(accountId) {
  return Analytics.Management.Filters.list(accountId).items;
}

/**
 * Lists filter links for the views under a UA property.
 * @param {string|number} accountId The GA account ID.
 * @param {string} propertyId The UA property ID.
 * @param {string|number} viewId The UA view ID.
 * @return {!Array} An array of UA filter links.
 */
function getFilterLinks(accountId, propertyId, viewId) {
  return Analytics.Management.ProfileFilterLinks
      .list(accountId, propertyId, viewId)
      .items;
}

/**
 * Lists the account summaries for all UA accounts a user can access.
 * @return {!Array} An array of account summaries.
 */
function getAccountSummaries() {
  return Analytics.Management.AccountSummaries.list();
}

/**
 * Lists the remarketing audiences in a Universal Analytics property.
 * @param {string|number} accountId The GA account ID.
 * @param {string} propertyId The UA property ID.
 * @param {number} startIndex The start index for the returned audiences.
 * @return {!Array} An array of remarketing audiences.
 */
function listRemarketingAudiences(accountId, propertyId, startIndex) {
  return Analytics.Management.RemarketingAudience.list(
      accountId, propertyId, {'start-index': startIndex});
}

/**
 * Lists the goals for the views under a UA property.
 * @param {string|number} accountId The GA account ID.
 * @param {string} propertyId The UA property ID.
 * @param {string|number} viewId The UA view ID.
 * @return {!Array} An array of goals in a view.
 */
function listGoals(accountId, propertyId, viewId) {
  return Analytics.Management.Goals.list(accountId, propertyId, viewId).items;
}

/**
 * Creates a goal in a view under the UA property.
 * @param {!Object} request The request data to create a goal.
 * @return {!Object} An object describing the goal that was created.
 */
function createGoal(request) {
  return Analytics.Management.Goals.insert(
      request.resource, request.accountId, request.webPropertyId,
      request.profileId);
}

/**
 * Returns either the read or write range for a given sheet.
 * @param {string} name The name of the sheet for the range.
 * @param {string} type Either read or write.
 * @return {!Object|null} The specified range object.
 */
function getSheetRange(name, type) {
  if (name == sheetNames.ua.viewDetails) {
    return sheetRanges.ua.viewDetailsList[type];
  } else if (name == sheetNames.ua.customDimensions) {
    return sheetRanges.ua.customDimensions[type];
  } else if (name == sheetNames.ua.modifyCdsResults) {
    return sheetRanges.ua.modifyCdsResults[type];
  } else if (name == sheetNames.ua.customMetrics) {
    return sheetRanges.ua.customMetrics[type];
  } else if (name == sheetNames.ua.events) {
    return sheetRanges.ua.events[type];
  } else if (name == sheetNames.ua.accountSummaries) {
    return sheetRanges.ua.accountSummaries[type];
  } else if (name == sheetNames.ua.settings) {
    return sheetRanges.ua.settings[type];
  } else if (name == sheetNames.ua.filters) {
    return sheetRanges.ua.filters[type];
  } else if (name == sheetNames.ua.audiences) {
    return sheetRanges.ua.audiences[type];
  } else if (name == sheetNames.ua.goals) {
    return sheetRanges.ua.goals[type];
  } else if (name == sheetNames.ga4.accountSummaries) {
    return sheetRanges.ga4.accountSummaries[type];
  } else if (name == sheetNames.ga4.streams) {
    return sheetRanges.ga4.streams[type];
  } else if (name == sheetNames.ga4.customDimensions) {
    return sheetRanges.ga4.customDimensions[type];
  } else if (name == sheetNames.ga4.customMetrics) {
    return sheetRanges.ga4.customMetrics[type];
  } else if (name == sheetNames.ga4.conversionEvents) {
    return sheetRanges.ga4.conversionEvents[type];
  } else if (name == sheetNames.ga4.adsLinks) {
    return sheetRanges.ga4.adsLinks[type];
  } else if (name == sheetNames.ga4.firebaseLinks) {
    return sheetRanges.ga4.firebaseLinks[type];
  } else {
    return null;
  }
}

/**
 * Returns an array of selected properties based on the selected views.
 * @param {!Array<!Array>} selectedViews An array of the selected views.
 * @return {!Array<!Array>} A deduplicated list of selected properties based on
 *     the selected views.
 */
function getSelectedProperties(selectedViews) {
  return selectedViews.filter((row, index) => {
    if (index == 0) {
      return row;
    } else if (row[3] != selectedViews[index - 1][3]) {
      return row;
    }
  });
}

/**
 * Returns a double array of all properties in all accounts.
 * @return {!Array<!Array>} A double array of all propertiesunder all accounts a
 *     user has access to.
 */
function getAllProperties() {
  const finalProperties = [];
  const summaries = getAccountSummaries();
  for (let i = 0; i < summaries.items.length; i++) {
    const accountName = summaries.items[i].name;
    const accountId = summaries.items[i].id;
    const properties = summaries.items[i].webProperties;
    if (properties !== undefined) {
      for (let j = 0; j < properties.length; j++) {
        const propertyName = properties[j].name;
        const propertyId = properties[j].id;
        let is360 = false;
        if (properties[j].level == 'PREMIUM') {
          is360 = true;
        }
        finalProperties.push(
            [accountName, accountId, propertyName, propertyId, is360]);
      }
    }
  }
  return finalProperties;
}

/**
 * Writes data to a specified sheet.
 * @param {!Array} data The data to be written to the sheet.
 * @param {string} sheetName The name of the sheet to which the data will be
 *     written.
 */
function writeToSheet(data, sheetName) {
  const ranges = getSheetRange(sheetName, 'write');
  let sheet = ss.getSheetByName(sheetName);
  if (sheet == undefined) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
  }
  sheet.getRange(ranges.row, ranges.column, data.length, ranges.numColumns)
      .setValues(data);
}

/**
 * Retrieves data from a specified sheet.
 * @param {string} sheetName The sheet name where the data is located.
 * @return {!Array<!Array>} A two dimensional array of the rows of data
 *     retrieved from the sheet.
 */
function getDataFromSheet(sheetName) {
  const ranges = getSheetRange(sheetName, 'read');
  let sheet = ss.getSheetByName(sheetName);
  if (sheet == undefined) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
    SpreadsheetApp.getUi().alert('Enter Settings');
    return;
  }
  return sheet
      .getRange(
          ranges.row, ranges.column, sheet.getLastRow(), ranges.numColumns)
      .getValues();
}

/**
 * Retrieve settings from thee settings sheet.
 * @return {!Object} The settings from the settings sheet.
 */
function getSettings() {
  const settingsValues = getDataFromSheet('UA Settings');
  const rawStartDate = settingsValues[0][0];
  const rawEndDate = settingsValues[1][0];
  const timeZone = settingsValues[2][0] || 'EST';
  let settingsObject = {
    startDate: Utilities.formatDate(rawStartDate, timeZone, 'yyyy-MM-dd'),
    endDate: Utilities.formatDate(rawEndDate, timeZone, 'yyyy-MM-dd')
  };
  return settingsObject;
}

/**
 * Get selected views from the account summaries sheet based
 * on which views have a checked checkbox.
 * @return {!Array<!Array>} A two dimensional array of the selected
 * views retrieved from the sheet.
 */
function getSelectedViews() {
  const views = getDataFromSheet(sheetNames.ua.accountSummaries);
  return views.filter(row => row[6]);
}

/**
 * Get selected properties from the account summaries sheet based
 * on which views have a checked box.
 * @return {!Array<!Array>} A two dimensional array of the selected
 * properties retrieved from the sheet.
 */
function getSelectedGa4Properties() {
  const properties = getDataFromSheet(sheetNames.ga4.accountSummaries);
  return properties.filter(row => row[4]);
}

/**
 * Sets UA and GA4 sheets to be hidden or shown.
 * @param {string} gaType Either "ua" or "ga4".
 * @param {string} action Either "hide" or "show".
 */
function showOrHideSheets(gaType, action) {
  const sheets = ss.getSheets();
  sheets.forEach(sheet => {
    for (name in sheetNames[gaType]) {
      if (sheetNames[gaType][name] == sheet.getName()) {
        if (action == 'hide') {
          sheet.hideSheet();
        } else if (action == 'show') {
          sheet.showSheet();
        }
      }
    }
  });
}

/**
 * Hides universal analytics sheets.
 */
function hideUASheets() {
  showOrHideSheets('ua', 'hide');
}

/**
 * Shows universal analytics sheets.
 */
function showUASheets() {
  showOrHideSheets('ua', 'show');
}

/**
 * Hides GA4 sheets.
 */
function hideGA4Sheets() {
  showOrHideSheets('ga4', 'hide');
}

/**
 * Shows GA4 sheets.
 */
function showGA4Sheets() {
  showOrHideSheets('ga4', 'show');
}
