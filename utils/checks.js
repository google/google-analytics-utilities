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
    There is a new version of this tool available. Please use the latest version of the tool by using the files 
    on Github or making a copy of this spreadsheet:
    https://docs.google.com/spreadsheets/d/1yZVgAlMJbCpZDyimdj0h4QHQbogLJZv83oXqRwT-A40/
    
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
  const rawReleaseVersion = settingsSheet.getRange(1, 2, 1, 1).getValue();
  const dismissedUpdateRange =settingsSheet.getRange(2, 2, 1, 1);
  if (!dismissedUpdateRange.getValue()) {
    const releases = JSON.parse(
      UrlFetchApp.fetch(
        'https://api.github.com/repos/google/google-analytics-utilities/releases'
      ).getContentText());
    const sheetReleaseVersion = rawReleaseVersion.split('v')[1].split('.');
    for (let i = 0; i < releases.length; i++) {
      const release = releases[i];
      const version = release.tag_name.split('v')[1].split('.');
      const title = 'Update Avilable';
      const message = messageText.newRelease + release.body + `
      
      ` + release.html_url;
      if (parseInt(sheetReleaseVersion[0]) < parseInt(version[0])) {
        const response = ui.alert(title, message, ui.ButtonSet.OK);
        if (response == ui.Button.OK || response == ui.Button.CLOSE) {
          dismissedUpdateRange.setValue(true);
        }
        break;
      } else if (parseInt(sheetReleaseVersion[1]) < parseInt(version[1])) {
        const response = ui.alert(title, message, ui.ButtonSet.OK);
        if (response == ui.Button.OK || response == ui.Button.CLOSE) {
          dismissedUpdateRange.setValue(true);
        }
        break;
      } else if (parseInt(sheetReleaseVersion[2]) < parseInt(version[2])) {
        const response = ui.alert(title, message, ui.ButtonSet.OK);
        if (response == ui.Button.OK || response == ui.Button.CLOSE) {
          dismissedUpdateRange.setValue(true);
        }
        break;
      }
    }
  }
}