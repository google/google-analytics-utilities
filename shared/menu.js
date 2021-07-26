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

function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Google Analytics Utilities')
    .addSubMenu(
      ui.createMenu('Universal Analytics')
      .addItem('List Account Summaries', 'writeAccountSummariesToSheet')
      .addItem('List View Details', 'writeViewDetailsToSheet')
      .addItem('List Events', 'writeEventsToSheet')
      .addItem('List Custom Dimensions', 'writeCustomDimensionsToSheet')
      .addItem('List Custom Metrics', 'writeCustomMetricsToSheet')
      .addItem('List Filters', 'writeFilterDataToSheet')
      .addItem('List Remarketing Audience Settings', 'writeAudiencesToSheet')
      .addSubMenu(
        ui.createMenu('Goals')
        .addItem('List Goals', 'writeGoalsToSheet')
        .addItem('Create Goals', 'createGoals')))
    .addSubMenu(
      ui.createMenu('Google Analytics 4')
      .addItem('List Account Summaries', 'writeGA4AccountSummariesToSheet')
      .addItem('List Properties and Streams', 'writeGA4StreamsToSheet')
      .addItem('List Custom Dimensions', 'writeGA4CustomDimensionsToSheet')
      .addItem('List Custom Metrics', 'writeGA4CustomMetricsToSheet')
      .addItem('List Conversion Events', 'writeGA4ConversionEventsToSheet')
      .addItem('List Google Ads Links', 'writeGA4AdsLinksToSheet')
      .addItem('List Firebase Links', 'writeGA4FirebaseLinksToSheet')
    )
    .addSeparator()
    .addSubMenu(
      ui.createMenu('Show/Hide Sheets')
      .addItem('Hide UA Sheets', 'hideUASheets')
      .addItem('Show UA Sheets', 'showUASheets')
      .addItem('Hide GA4 Sheets', 'hideGA4Sheets')
      .addItem('Show GA4 Sheets', 'showGA4Sheets')
    )
    .addToUi();
}