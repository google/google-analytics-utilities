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
 * Constructs a new report request based on the view ID, 
 * start date, and end date provided.
 * @param {!Array<!Array>} viewId
 * @param {string} startDate
 * @param {string} endDate
 * @return {!Object} Retuns the report object.
 */
function constructReport(viewId, startDate, endDate) {
  const report = AnalyticsReporting.newReportRequest();
  report.dimensions = [];
  report.metrics = [];
  report.dateRanges = [];
  report.orderBys = [];
  const dimensionNames = ['ga:eventCategory', 'ga:eventAction', 'ga:eventLabel'];
  for (let i = 0; i < dimensionNames.length; i++) {
    let tempDim = AnalyticsReporting.newDimension();
    tempDim.name = dimensionNames[i];
    report.dimensions.push(tempDim);
  }
  const totalEvents = AnalyticsReporting.newMetric();
  totalEvents.alias = 'Total Events';
  totalEvents.expression = 'ga:totalEvents';
  totalEvents.formattingType = 'INTEGER';
  report.metrics.push(totalEvents);
  report.viewId = viewId;
  report.hideTotals = true;
  const dateRange = AnalyticsReporting.newDateRange();
  dateRange.startDate = startDate;
  dateRange.endDate = endDate;
  report.dateRanges.push(dateRange);
  let ob = AnalyticsReporting.newOrderBy();
  ob.fieldName = 'ga:eventCategory';
  ob.orderType = 'VALUE';
  ob.sortOrder = 'DESCENDING';
  report.orderBys.push(ob);
  return report;
}

/**
 * Adds the account, property, and view names and views to the
 * two dimensional array that contains the event data.
 * @param {!Array<!Array>} data
 * @param {string} accountName
 * @param {string|number} accountId
 * @param {string} propertyName
 * @param {string|number} propertyId
 * @param {string} viewName
 * @param {string|number} viewId
 * @return {!Array<!Array>} A two dimensional array where each array
 * contains the event data as well as the account, property, and view
 * names and IDs where the events originated.
 */
function formatData(data, accountName, accountId, propertyName, propertyId, viewName, viewId) {
  const tempArray = [];
  for (let i = 0; i < data.length; i++) {
    data[i].dimensions.unshift(accountName, accountId, propertyName, propertyId, viewName, viewId);
    data[i].dimensions.push(data[i].metrics[0].values[0]);
    tempArray.push(data[i].dimensions);
  }
  return tempArray;
}

/**
 * Writes event data to the sheet.
 */
function writeEventsToSheet() {
  const views = getSelectedViews();
  const settings = getSettings();
  const startDate = settings.startDate;
  const endDate = settings.endDate;
  let finalData = [];
  for (let i = 0; i < views.length; i++) {
    const accountName = views[i][0];
    const accountId = views[i][1];
    const propertyName = views[i][2];
    const propertyId = views[i][3];
    const viewName = views[i][4];
    const viewId = views[i][5].toString();
    const report = constructReport(viewId, startDate, endDate);
    const data = getData(report);
    if (data != undefined) {
      const formatedData = formatData(data, accountName, accountId, propertyName, propertyId, viewName, viewId);
      finalData = finalData.concat(formatedData);
    } else if (data == undefined) {
      finalData = finalData.concat([[
        accountName, accountId, propertyName, propertyId, viewName, viewId, 
        'No Events', 'No Events', 'No Events', 'No Events']])
    }
  }
  writeToSheet(finalData, sheetsMeta.ua.events.sheetName);
}