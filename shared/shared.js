/**
 * Copyright 2024 Google LLC
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
const apiActionTaken = {
  ga4: {
    deleted: 'Deleted',
    created: 'Created',
    archived: 'Archived',
    skipped: 'Skipped',
    error: 'Error',
    updated: 'Updated'
  }
};

/**
 * Lists all values across all GA4 sheets.
 */
function listAllGA4PropertyResources() {
    writeGA4AudiencesToSheet();
    writeGA4KeyEventsToSheet();
    writeGA4StreamsToSheet();
    writeGA4PropertyDetailsToSheet();
    writeGA4CustomDimensionsToSheet();
    writeGA4CustomMetricsToSheet();
    writeGA4CalculatedMetricsToSheet();
    writeGA4AdsLinksToSheet();
    writeGA4DV360LinksToSheet();
    writeGA4FirebaseLinksToSheet();
    writeGA4SA360LinksToSheet();
    writeGA4BigQueryLinksToSheet();
    writeGA4AdSenseLinksToSheet();
    writeGA4ChannelGroupsToSheet();
    writeGA4ExpandedDataSetsToSheet();
    writeGA4AdSenseLinksToSheet();
    writeGA4EventCreateRulesToSheet();
    writeGA4RollupPropertySourceLinksToSheet();
    writeGA4SubpropertyEventFiltersToSheet();
}

/**
 * Returns either the read or write range for a given sheet.
 * @param {string} name The name of the sheet for the range.
 * @param {string} type Either read or write.
 * @return {!Object|null} The specified range object.
 */
function getSheetRange(name, type) {
  for (n in sheetsMeta.ga4) {
    if (name == sheetsMeta.ga4[n].sheetName) {
      return sheetsMeta.ga4[n][type];
    }
  }
  for (n in sheetsMeta.ua) {
    if (name == sheetsMeta.ua[n].sheetName) {
      return sheetsMeta.ua[n][type];
    }
  }
  return null;
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
 * Returns a double array of all properties in all accounts.
 * @return {!Array<!Array>} A double array of all properties under all accounts
 * a user has access to.
 */
function getAllPropertiesWithInternalIds() {
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
        const internalPropertyId = properties[j].internalWebPropertyId;
        let is360 = false;
        if (properties[j].level == 'PREMIUM') {
          is360 = true;
        }
        finalProperties.push(
            [accountName, accountId, propertyName, propertyId,
            internalPropertyId, is360]);
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
  if (data.length > 0) {
    sheet.getRange(ranges.row, ranges.column, data.length, ranges.numColumns)
         .setValues(data);
  }
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
  return sheet.getRange(
    ranges.row, ranges.column,
    sheet.getLastRow() - ranges.row + 1, ranges.numColumns).getValues();
}
/**
 * Get selected properties from the account summaries sheet based
 * on which views have a checked box.
 * @return {!Array<!Array>} A two dimensional array of the selected
 * properties retrieved from the sheet.
 */
function getSelectedGa4Properties() {
  const properties = getDataFromSheet(sheetsMeta.ga4.accountSummaries.sheetName);
  return properties.filter(row => row[4]);
}

/**
 * Writes the action that was taken on an entity to a sheet.
 * @param {string} sheetName The name of the sheet being written to.
 * @param {number} index The index of the entity that is being acted
 * upon in the two dimensional array of entity data.
 * @param {string} status The action taken for a given entity.
 */
function writeActionTakenToSheet(sheetName, index, actionTaken) {
	// The actual row to be written to is offset from the index value by 2, so
	// the index value must be increased by two.
	const writeRow = index + 2;
  const actionTakenColumn = ss.getSheetByName(sheetName).getLastColumn();
	const numRows = 1;
	const numColumns = 1;
	ss.getSheetByName(sheetName).getRange(
		writeRow, actionTakenColumn, numRows, numColumns
	).setValue(actionTaken);
}

/**
 * Clears a sheet of content.
 * @param {!Object} sheetsMetaField The object from the sheetsMeta variable.
 */
function clearSheetContent(sheetsMetaField) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(
    sheetsMetaField.sheetName);
  sheet.getRange(
    2, 1, sheet.getLastRow(), sheet.getLastColumn()
  ).clearContent();
}

/**
 * Builds a GA4 report object.
 * @param {!Array<string>} dimensions Dimensions requested in the report.
 * @param {!Array<string>} metrics Metrics requested in the report.
 * @param {string} startDate Start date for the report.
 * @param {string} endDate End date for the report.
 * @param {!Object} dimensionFilter Dimension filters for the report.
 * @returns {!Object} Analytics report object.
 */
function generateGA4DataReportRequest(dimensions, metrics, startDate, endDate, dimensionFilter) {
  const request = AnalyticsData.newRunReportRequest();
  // Sets metrics.
  if (metrics.length > 0) {
    const reportMetrics = [];
    metrics.forEach(metric => {
      const newMetric = AnalyticsData.newMetric();
      newMetric.name = metric;
      reportMetrics.push(newMetric);
    });
    request.metrics = reportMetrics;
  }
  // Sets dimensions.
  if (dimensions.length > 0) {
    const reportDimensions = [];
    dimensions.forEach(dimension => {
      const newDimension = AnalyticsData.newDimension();
      newDimension.name = dimension;
      reportDimensions.push(newDimension);
    });
    request.dimensions = reportDimensions;
  }
  // Sets date range.
  const dateRange = AnalyticsData.newDateRange();
  dateRange.startDate = startDate;
  dateRange.endDate = endDate;
  request.dateRanges = dateRange;
  // Sets dimension filter.
  if (Object.keys(dimensionFilter).length > 0) {
    const newFilter = AnalyticsData.newFilterExpression();
    newFilter.filter = AnalyticsData.newFilter();
    newFilter.filter.fieldName = dimensionFilter.name;
    newFilter.filter.stringFilter = AnalyticsData.newStringFilter();
    newFilter.filter.stringFilter.matchType = dimensionFilter.matchType;
    newFilter.filter.stringFilter.value = dimensionFilter.value;
    request.dimensionFilter = newFilter;
  }
  return request;
}

/**
 * Auto-resize all row heights for a sheet.
 * @param {string} sheetName
 * @param {number} rowHeight Row height in pixels.
 */
function resizeRowHeights(sheetName, rowHeight) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  sheet.setRowHeightsForced(2, sheet.getLastRow() - 1, rowHeight);
}

/**
 * List properties, accounts, and data streams in an array to be used for
 * selection purposes.
 */
function writeDataStreamSelectionToSheet() {
  const streamArray = [];
  const selectedProperties = getSelectedGa4Properties();
  for (let i = 0; i < selectedProperties.length; i++) {
    const currentRow = selectedProperties[i];
    const propertyName = `properties/${currentRow[3]}`;
    const dataStreams = listGA4Entities('streams', propertyName).dataStreams;
    if (dataStreams) {
      for (let j = 0; j < dataStreams.length; j++) {
        const currentStream = dataStreams[j];
        streamArray.push([
          currentRow[0],
          currentRow[1],
          currentRow[2],
          currentRow[3],
          currentStream.displayName,
          currentStream.name.split('dataStreams/')[1]]
        );
      }
    }
  }
  writeToSheet(streamArray, sheetsMeta.ga4.dataStreamSelection.sheetName);
}
/**
 * Get selected data streams from the data stream selection sheet based.
 * @return {!Array<!Array>} A two dimensional array of the selected
 * stream retrieved from the sheet.
 */
function getSelectedGa4DataStreams() {
  const streams = getDataFromSheet(
    sheetsMeta.ga4.dataStreamSelection.sheetName);
  return streams.filter(row => row[4]);
}