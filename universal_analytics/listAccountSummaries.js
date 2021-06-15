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

/**
 * Retrieves the account summaries object and flattens it
 * into a two dimensional array where a new internal array is created
 * to contain the account, property, and view names and IDs
 * for each view.
 * @return {!Array<!Array>} The account summaries array of 
 * view arrays
 */
function getFlattenedAccountSummaries() {
  var flattenedArray = [];
  var summaries = getAccountSummaries();
  for (var i = 0; i < summaries.items.length; i++) {
    var accountName = summaries.items[i].name;
    var accountId = summaries.items[i].id;
    var properties = summaries.items[i].webProperties;
    if (properties !== undefined) {
      for (var j = 0; j < properties.length; j++) {
        var propertyName = properties[j].name;
        var propertyId = properties[j].id;
        var views = properties[j].profiles
        if (views !== undefined) {
          for (var k = 0; k < views.length; k++) {
            var viewName = views[k].name;
            var viewId = views[k].id;
            flattenedArray.push([
              accountName,
              accountId,
              propertyName,
              propertyId,
              viewName,
              viewId
            ]);
          }
        }
      }
    }
  }
  return flattenedArray;
}

/**
 * Retrieves the flattened account summaries object
 * and writes it to the Account Summaries sheet.
 */
function writeAccountSummariesToSheet() {
  var accountSummaries = getFlattenedAccountSummaries();
  writeToSheet(accountSummaries, sheetNames.ua.accountSummaries);
}