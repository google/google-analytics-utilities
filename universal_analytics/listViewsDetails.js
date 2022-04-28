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
 * Retreive the views in a property and format the selected
 * views to be returned as a two dimensional array where each inner
 * array is separate view.
 * @param {!Array<!Array>} selectedViews Views that have been
 * selected to have their data returned.
 * @return {!Array<!Array>} A two dimensional array where each
 * inner array is a separate view.
 */
function listViewDetails(selectedViews) {
  const selectedViewDetails = [];
  let tempViews = []
  selectedViews.forEach((row, index) => {
    const accountId = row[1];
    const propertyId = row[3];
    if (index != 0) {
      if (propertyId != selectedViews[index-1][3] || selectedViewDetails == []) {
        tempViews = getViewDetails(accountId, propertyId);
      }
    } else {
      tempViews = getViewDetails(accountId, propertyId);
    }
    for (let i = 0; i < tempViews.length; i++) {
      const tempViewDetails = tempViews[i];
      if (tempViewDetails.id == row[5]) {
        const tempArray = [
          tempViewDetails.accountId,
          row[0],
          tempViewDetails.webPropertyId,
          row[2],
          tempViewDetails.name,
          tempViewDetails.id,
          tempViewDetails.currency,
          tempViewDetails.timezone,
          tempViewDetails.websiteUrl,
          tempViewDetails.defaultPage,
          tempViewDetails.excludeQueryParameters,
          tempViewDetails.siteSearchQueryParameters,
          tempViewDetails.stripSiteSearchQueryParameters,
          tempViewDetails.siteSearchCategoryParameters,
          tempViewDetails.stripSiteSearchCategoryParameters,
          tempViewDetails.type,
          tempViewDetails.eCommerceTracking,
          tempViewDetails.enhancedECommerceTracking,
          tempViewDetails.botFilteringEnabled,
          tempViewDetails.starred,
          tempViewDetails.created,
          tempViewDetails.updated
        ]
        selectedViewDetails.push(tempArray);
      }
    }
  });
  return selectedViewDetails;
}

/**
 * Writes view details to the sheet.
 */
function writeViewDetailsToSheet() {
  viewDetails = listViewDetails(getSelectedViews());
  writeToSheet(viewDetails, sheetsMeta.ua.viewDetailsList.sheetName)
}