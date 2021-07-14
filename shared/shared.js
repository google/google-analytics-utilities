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

const sheetRanges = {
  ua: {
      viewDetailsList: {
      read: {},
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 22
      }
    },
    customDimensions: {
      read: {},
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 6
      }
    },
    customMetrics: {
      read: {},
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 9
      }
    },
    events: {
      read: {},
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 10
      }
    },
    accountSummaries: {
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 7
      },
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 6
      }
    },
    filters: {
      read: {},
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 26
      }
    },
    audiences: {
      write: {},
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 18
      }
    },
    goals: {
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 23
      },
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 22
      }
    },
    settings: {
      read: {
        row: 2,
        column: 2,
        numRows: 2,
        numColumns: 1
      }
    }
  },
  ga4: {
    accountSummaries: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 4
      },
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 5
      }
    },
    streams: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 25
      },
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 26
      }
    }
  }
}

const sheetNames = {
  ua: {
    viewDetails: 'View Details List',
    customDimensions: 'Custom Dimensions',
    customMetrics: 'Custom Metrics',
    events: 'UA Events',
    accountSummaries: 'UA Account Summaries',
    settings: 'UA Settings',
    filters: 'Filters',
    audiences: 'UA Audiences',
    goals: 'Goal Settings'
  },
  ga4: {
    accountSummaries: 'GA4 Account Summaries',
    streams: 'Data Streams'
  }
}

function getViewDetails(accountId, propertyId) {
  return Analytics.Management.Profiles.list(accountId, propertyId).items;
}

function getCustomDimensions(accountId, propertyId) {
  return Analytics.Management.CustomDimensions.list(accountId, propertyId).items;
}

function getCustomMetrics(accountId, propertyId) {
  return Analytics.Management.CustomMetrics.list(accountId, propertyId).items;
}

function getAllFilters(accountId) {
  return Analytics.Management.Filters.list(accountId).items;
}

function getFilterLinks(accountId, propertyId, viewId) {
  return Analytics.Management.ProfileFilterLinks.list(accountId, propertyId, viewId).items;
}

function getAccountSummaries() {
  return Analytics.Management.AccountSummaries.list();
}

function listRemarketingAudiences(accountId, propertyId, startIndex) {
  return Analytics.Management.RemarketingAudience.list(
		accountId, propertyId, {'start-index': startIndex}
	);
}

function listGoals(accountId, propertyId, viewId) {
  return Analytics.Management.Goals.list(accountId, propertyId, viewId).items;
}

function createGoal(request) {
  return Analytics.Management.Goals.insert(
		request.resource,
		request.accountId,
		request.webPropertyId,
		request.profileId
	);
}

/**
 * Returns either the read or write range for a given sheet.
 * @param {string} name The name of the sheet for the range.
 * @param {string} type Either read or write.
 * @return {!Object|null} The specified range object.
 */
function getSheetRange(name, type) {
  if (name === sheetNames.ua.viewDetails) {
    return sheetRanges.ua.viewDetailsList[type];
  } else if (name == sheetNames.ua.customDimensions) {
    return sheetRanges.ua.customDimensions[type];
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
    return sheetRanges.ua.goals[type]
  } else if (name == sheetNames.ga4.accountSummaries) {
    return sheetRanges.ga4.accountSummaries[type];
  } else if (name == sheetNames.ga4.streams) { 
    return sheetRanges.ga4.streams[type];
  } else {
    return null;
  }
}

/**
 * Retrieves and returns the Settings sheet object.
 * @return {!Object} The settings sheet object.
 */
function getSettingsSheet() {
  let settingsSheet = ss.getSheetByName('Settings');
  return settingsSheet;
}

/**
 * Returns an array of selected properties based on the
 * selected views.
 * @param {!Array<!Array>} selectedViews An array
 * of the selected views.
 * @return {Array<!Array} A deduplicated list of
 * selected properties based on the selected views.
 */
function getSelectedProperties(selectedViews) {
  return selectedViews.filter((row, index) => {
    if (index == 0) {
      return row;
    } else if (row[3] != selectedViews[index-1][3]) {
      return row;
    }
  });
}

/**
 * Writes data to a specified sheet.
 * param {!Array} data The data to be written to the sheet.
 * param {string} sheetName The name of the sheet to which
 * the data will be written.
 */
function writeToSheet(data, sheetName) {
  const ranges = getSheetRange(sheetName, 'write');
  let sheet = ss.getSheetByName(sheetName);
  if (sheet == undefined) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
  }
  sheet.getRange(
    ranges.row, 
    ranges.column,
    data.length,
    ranges.numColumns).setValues(data);
}

/**
 * Retrieves data from a specified sheet.
 * @param {string} sheetName The sheet name where the
 * data is located.
 * @return {!Array<Array>} A two dimensional array of the rows
 * of data retrieved from the sheet.
 */
function getDataFromSheet(sheetName) {
  const ranges = getSheetRange(sheetName, 'read');
  let sheet = ss.getSheetByName(sheetName);
  if (sheet == undefined) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
    SpreadsheetApp.getUi().alert('Enter Settings');
    return;
  }
 return sheet.getRange(
    ranges.row, 
    ranges.column,
    sheet.getLastRow(),
    ranges.numColumns)
  .getValues();
}

/**
 * Retrieve settings from thee settings sheet.
 * @return {!Object} The settings from the settings sheet.
 */
function getSettings() {
  const settingsValues = getDataFromSheet('Settings');
  const rawStartDate = settingsValues[0][0];
  const rawEndDate = settingsValues[1][0];
  let settingsObject = {
    startDate: rawStartDate.getFullYear() + '-' + (rawStartDate.getMonth() + 1)
		+ '-' + rawStartDate.getDate(),
    endDate: rawEndDate.getFullYear() + '-' + (rawEndDate.getMonth() + 1)
		+ '-' + rawEndDate.getDate(),
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

function hideUASheets() {
  showOrHideSheets('ua', 'hide');
}

function showUASheets() {
  showOrHideSheets('ua', 'show');
}

function hideGA4Sheets() {
  showOrHideSheets('ga4', 'hide');
}

function showGA4Sheets() {
  showOrHideSheets('ga4', 'show');
}