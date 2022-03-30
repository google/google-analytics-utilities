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
function constructMetricsReport(viewId, startDate, endDate) {
  const report = AnalyticsReporting.newReportRequest();
  report.metrics = [];
  report.dateRanges = [];
  const headers = getMetricHeaders();
  if (headers.length > 0) {
    headers[0].forEach(metric => {
      if (metric != '') {
        const newMetric = AnalyticsReporting.newMetric();
        newMetric.expression = metric;
        report.metrics.push(newMetric);
      }
    });
  } else {
    return report;
  }
  report.viewId = viewId;
  report.hideTotals = true;
  const dateRange = AnalyticsReporting.newDateRange();
  dateRange.startDate = startDate;
  dateRange.endDate = endDate;
  report.dateRanges.push(dateRange);
  return report;
}

/**
 * Retrieves the metric expressions from the sheet.
 */
function getMetricHeaders() {
  const headers = ss.getSheetByName(sheetsMeta.ua.metricsRequest.sheetName)
	.getRange(1, 7, 1, 10).getValues();
  return headers;
}

/**
 * Adds the account, property, and view names and views to the
 * two dimensional array that contains the metric data.
 * @param {!Array<!Array>} data
 * @param {string} accountName
 * @param {string|number} accountId
 * @param {string} propertyName
 * @param {string|number} propertyId
 * @param {string} viewName
 * @param {string|number} viewId
 * @return {!Array<!Array>} A two dimensional array where each array
 * contains the event data as well as the account, property, and view
 * names and IDs where the metrics originated.
 */
function formatMetricData(
	data,
	accountName,
	accountId,
	propertyName,
	propertyId,
	viewName,
	viewId
) {
  const tempArray = [
		accountName, accountId, propertyName,
		propertyId, viewName, viewId
	];
  for (let i = 0; i < 10; i++) {
    const value = data[0].metrics[0].values[i]; // The metric value.;
    tempArray.push(value || '');
  }
  return tempArray;
}

/**
 * Retrieves metric data and formats it to be written to a sheet.
 */
function writeMetricsDataToSheet() {
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
    const report = constructMetricsReport(viewId, startDate, endDate);
    const data = getData(report);
    if (data != undefined) {
      const formatedData = formatMetricData(
				data, accountName, accountId, propertyName, 
				propertyId, viewName, viewId
			);
      finalData.push(formatedData);
    } else if (data == undefined) {
      finalData.push([
        accountName, accountId, propertyName, propertyId, viewName, viewId, 
        '', '', '', '', '', '', '', '', '', '']);
    }
    Utilities.sleep(150);
  }
  writeToSheet(finalData, sheetNames.ua.metricsRequest);
}