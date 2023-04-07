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

const messageText = {
  newRelease: `
    There is a new version of this tool available. Please use the latest version
    of the tool by using the files on Github or making a copy of this spreadsheet:
    https://docs.google.com/spreadsheets/d/1kJqwYNed8RTuAgjy0aRUooD__MIPqzUeiDF5LZ7v1aI/copy
    
    Update Details:
  `
}

/**
 * Checks if this is the latest version of the script and sheet.
 * If not, it prompts the user to create a new copy of the sheet
 * from Github.
 */
function checkRelease() {
  const ui = SpreadsheetApp.getUi();
  const settingsSheet = ss.getSheetByName('Settings');

  // Get sheet version.
  const rawReleaseVersion = settingsSheet.getRange(1, 2, 1, 1).getValue();
  const sheetReleaseVersion = parseFloat(rawReleaseVersion.split('v')[1]);

  // Get Github version.
  const releases = JSON.parse(
    UrlFetchApp.fetch(
      'https://api.github.com/repos/google/google-analytics-utilities/releases'
    ).getContentText());
  const latestGithubRelease = releases[0];
  const latestGithubVersion = parseFloat(
    latestGithubRelease.tag_name.split('v')[1]);
  
  if (sheetReleaseVersion < latestGithubVersion) {
    const title = 'Update Avilable';
    const message = messageText.newRelease + latestGithubRelease.body + `
  
  ` + latestGithubRelease.html_url;
    ui.alert(title, message, ui.ButtonSet.OK);
  } else {
    ui.alert('No updates avaialable.');
  }
}

/**
 * Check if a write response has an error and returns error information or
 * the action taken.
 * @param {!Array<!Object>} responses The response to the write request.
 * @param {string} requestType The kind of request that was made.
 * @return {string} Either the action taken or error information.
 */
function responseCheck(responses, requestType) {
  const output = [];
  responses.forEach(response => {
    if (response.details != undefined) {
      output.push('Error ' + response.details.code + ': ' + 
      response.details.message);
    } else if (response.statusCode != undefined) {
      output.push('Error ' + response.statusCode + ': ' + response.name);
    } else {
      if (requestType == 'create') {
        if (response.name) {
          output.push(response.name + ': ' + apiActionTaken.ga4.created);
        } else {
          output.push(apiActionTaken.ga4.created);
        }     
      } else if (requestType == 'update') {
        if (response.measurementUnit == 'CURRENCY') {
          output.push(response.name + ': ' + apiActionTaken.ga4.updated + 
          ' - NOTE: CURRENCY cannot be changed to a different measurement unit.'
          );
        } else {
          output.push(response.name + ': ' + apiActionTaken.ga4.updated);
        }
      } else if (requestType == 'archive') {
        output.push(apiActionTaken.ga4.archived);
      } else if (requestType == 'delete') {
        output.push(apiActionTaken.ga4.deleted);
      }
    }
  });
  return output.join('; ');
}