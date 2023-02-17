/**
 * Copyright 2023 Google LLC
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
 * Writes opt out status for all selected properties.
 */
function writeSelectedOptOutStatusesToSheet() {
  const sheetData = getDataFromSheet(sheetsMeta.ua.optOut.sheetName);
  const optOutStatuses = [];
  if (sheetData.length > 0) {
    sheetData.forEach(row => {
      const internalPropertyId = row[4];
      const selected = row[7];
      if (selected) {
        optOutStatuses.push([fetchOptOutStatus(internalPropertyId)]);
      } else {
        optOutStatuses.push(['']);
      }
    });
  }
  SpreadsheetApp.getActive().getSheetByName(sheetsMeta.ua.optOut.sheetName)
  .getRange(2, 7, optOutStatuses.length, 1).setValues(optOutStatuses);
}

/**
 * Sets the opt out status for all selected properties.
 */
function updateSelectedOptOutStatuses() {
  const sheetData = getDataFromSheet(sheetsMeta.ua.optOut.sheetName);
  const results = [];
  if (sheetData.length > 0) {
    sheetData.forEach(row => {
      const internalPropertyId = row[4];
      const optOutStatus = row[6];
      const selected = row[7];
      if (selected) {
        const result = setOptOutStatus(internalPropertyId, optOutStatus);
        if (result.result == 'success') {
          results.push(['Updated']);
        } else {
          results.push(['Error: ' + result.message])
        }
      } else {
        results.push(['']);
      }
    });
  }
  SpreadsheetApp.getActive().getSheetByName(sheetsMeta.ua.optOut.sheetName)
  .getRange(2, 9, results.length, 1).setValues(results);
}

/**
 * Gets the opt out status for a property.
 * @return {boolean} The opt out status for a given property.
 */
function fetchOptOutStatus(internalPropertyId) {
  try {
  const status = AnalyticsAdmin.Properties.fetchAutomatedGa4ConfigurationOptOut(
    {property: 'properties/' + internalPropertyId}).optOut || false;
  Utilities.sleep(ga4RequestDelay);
  return status;
  } catch(e) {
    return e.message;
  }
}

/**
 * Sets the opt out status for a property.
 * @return {!Object} 
 */
function setOptOutStatus(internalPropertyId, status) {
  try {
    const x = AnalyticsAdmin.Properties.setAutomatedGa4ConfigurationOptOut({
      property: 'properties/' + internalPropertyId,
      optOut: status
    });
    Utilities.sleep(ga4RequestDelay);
    return {result: 'success', message: ''};
  } catch(e) {
    return {result: 'failure', message: e.message};
  }
}

/**
 * Writes UA properties to a sheet.
 */
function writeUAPropertiesToSheet() {
  const properties = getAllPropertiesWithInternalIds();
  writeToSheet(properties, sheetsMeta.ua.optOut.sheetName);
}