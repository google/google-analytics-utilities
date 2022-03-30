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
 * Combines the account level details about the filter settings with
 * the link informatian that describes which filters are linked to 
 * which views.
 * @param {!Array<!Array>} filters
 * @param {!Array<!Array>} filterLinks
 * @return {!Array<!Array>} A two dimensional array where each
 * inner array contains filter data.
 */
function combineFilterDetailsAndViewNames(filters, filterLinks) {
  var sheetData = [];
  
  for (var i = 0; i < filterLinks.length; i++) {
    var currentFilterLink = filterLinks[i];
    var matchedFilter = filters.filter(function(filter) {
      return currentFilterLink.filterRef.id == filter.id;
    });
    var sheetRow = [];
    sheetRow.push(
      currentFilterLink.profileRef.name,
      currentFilterLink.profileRef.id,
      matchedFilter[0].name,
      matchedFilter[0].created,
      matchedFilter[0].updated,
      matchedFilter[0].type      
    );
    if (matchedFilter[0].includeDetails != undefined || matchedFilter[0].excludeDetails != undefined) {
      var details;
      if (matchedFilter[0].includeDetails != undefined) {
        details = matchedFilter[0].includeDetails;
      } else {
        details = matchedFilter[0].excludeDetails;
      }
      sheetRow.push(
        details.field,
        details.matchType,
        details.expressionValue,
        details.caseSensitive,
        details.fieldIndex || '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      );
    }
    if (matchedFilter[0].lowercaseDetails != undefined || matchedFilter[0].uppercaseDetails != undefined) {
      var details;
      if (matchedFilter[0].lowercaseDetails != undefined) {
        details = matchedFilter[0].lowercaseDetails;
      } else {
        details = matchedFilter[0].uppercaseDetails;
      }
      sheetRow.push(
        details.field,
        '',
        '',
        '',
        details.fieldIndex || '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      );
    }
    if (matchedFilter[0].searchAndReplaceDetails != undefined) {
      var searchAndReplaceDetails = matchedFilter[0].searchAndReplaceDetails;
      sheetRow.push(
        searchAndReplaceDetails.field,
        '',
        '',
        '',
        searchAndReplaceDetails.fieldIndex || '',
        searchAndReplaceDetails.searchString,
        searchAndReplaceDetails.replaceString,
        searchAndReplaceDetails.caseSensitive,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      );      
    }
    if (matchedFilter[0].advancedDetails != undefined) {
      var advancedDetails = matchedFilter[0].advancedDetails;
      sheetRow.push(
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        advancedDetails.caseSensitive,
        advancedDetails.fieldA,
        advancedDetails.fieldAIndex,
        advancedDetails.extractA,
        advancedDetails.fieldB,
        advancedDetails.fieldBIndex,
        advancedDetails.extractB,
        advancedDetails.outputToField,
        advancedDetails.outputToFieldIndex,
        advancedDetails.outputConstructor,
        advancedDetails.fieldARequired,
        advancedDetails.fieldBRequired,
        advancedDetails.overrideOutputField
      );
    }
    sheetData.push(sheetRow);
  }
  return sheetData;
}

/**
 * Writes  filter data to the sheet.
 */
function writeFilterDataToSheet() {
  const accountSummaries = getSelectedViews();
  let allFilters = [];
  let allCombinedData = [];
  accountSummaries.forEach((summary, index) => {
    const accountId = summary[1];
    const propertyId = summary[3];
    const viewId = summary[5];
    if (index != 0) {
      if (accountId != accountSummaries[index-1][1] || accountSummaries == []) {
        allFilters = getAllFilters(accountId);
      } 
    } else {
      allFilters = getAllFilters(accountId);
    }
    const filterLinks = getFilterLinks(accountId, propertyId, viewId);
    allCombinedData = allCombinedData.concat(combineFilterDetailsAndViewNames(allFilters, filterLinks));
  });
  writeToSheet(allCombinedData, sheetsMeta.ua.filters.sheetName);
}
