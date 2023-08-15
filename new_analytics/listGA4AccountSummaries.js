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
 * @param {!Array} summaries
 * @return {!Array<!Array>}
 */
function getFlattenedGA4AccountSummaries(summaries) {
  const flatSummaries = [];
  if (summaries != undefined) {
    summaries.forEach(account => {
      const accountDisplayName = account.displayName;
      const accountId = account.account.split('/')[1];
      if (account.propertySummaries != undefined) {
        account.propertySummaries.forEach(property => {
          const propertyDisplayName = property.displayName;
          const propertyId = property.property.split('/')[1];
          flatSummaries.push([
            accountDisplayName,
            accountId,
            propertyDisplayName,
            propertyId
          ]);
        });
      } else {
        flatSummaries.push([accountDisplayName, accountId, '', '']);
      }
    });
  }
  return flatSummaries;
}

/**
 * 
 */
function writeGA4AccountSummariesToSheet() {
  let summaries = listGA4Entities('accountSummaries');
  const flattenedSummaries = getFlattenedGA4AccountSummaries(summaries.accountSummaries);
  clearSheetContent(sheetsMeta.ga4.accountSummaries);
  writeToSheet(flattenedSummaries, sheetsMeta.ga4.accountSummaries.sheetName);
}