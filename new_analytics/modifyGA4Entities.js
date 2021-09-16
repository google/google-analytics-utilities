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
 * Archives or creates GA4 custom dimensions.
 */
function modifyGA4CustomDimensions() {
  modifyGA4Entities(sheetNames.ga4.customDimensions);
}

/**
 * Archives or creates GA4 custom metrics.
 */
function modifyGA4CustomMetrics() {
  modifyGA4Entities(sheetNames.ga4.customMetrics);
}

/**
 * Deletes or creates GA4 conversion events.
 */
function modifyGA4ConversionEvents() {
  modifyGA4Entities(sheetNames.ga4.conversionEvents);
}

/**
 * Deletes or creates GA4 Google Ads Links.
 */
function modifyGA4AdsLinks() {
  modifyGA4Entities(sheetNames.ga4.adsLinks);
}

/**
 * Deletes or creates GA4 Firebase links.
 */
function modifyGA4FirebaseLinks() {
  modifyGA4Entities(sheetNames.ga4.firebaseLinks);
}

/**
 * @param {string} sheetName The name of the sheet from which
 * the data will be retrieved.
 */
function modifyGA4Entities(sheetName) {
  let entities = getDataFromSheet(sheetName);
  filteredEntity = entities.filter(
		entity => entity[0] != '');
  if (filteredEntity.length > 0) {
    filteredEntity.forEach((entity, index) => {
      let response = null;
      let deleteOrArchive = null;
      let create = null;
      let actionTaken = null;

      const payload = {};
      // Data consistent across GA4 sheets.
			const propertyPath = 'properties/' + entity[3];
			const entityDisplayNameOrId = entity[4];
			const entityPath = entity[5];

      // Adds information to the payload that is unique
      // for the given entity that is being created.
      if (sheetName == sheetNames.ga4.customDimensions ||
      sheetName == sheetNames.ga4.customMetrics) {
        // Add custom dimension or metric fields.
        const parameterName = entity[6];
        const scope = entity[7];
        const description = entity[9];
		  	deleteOrArchive = entity[10];
		  	create = entity[11];
        payload.displayName = entityDisplayNameOrId;
        payload.scope = scope;
        payload.description = description;
        payload.parameterName = parameterName;     
        if (sheetName == sheetNames.ga4.customDimensions) {
          // Add custom dimension fields.
          const disallowAdsPersonalization = entity[8];
          payload.disallowAdsPersonalization = disallowAdsPersonalization || false;
        } else if (sheetName == sheetNames.ga4.customMetrics) {
          // Add custom metric fields.
          const measurementUnit = entity[8];
          payload.measurementUnit = measurementUnit;
        }
      } else if (sheetName == sheetNames.ga4.conversionEvents) {
        // Add conversion event fields.
        deleteOrArchive = entity[8];
        create = entity[9];
        payload.eventName = entityDisplayNameOrId;
      } else if (sheetName == sheetNames.ga4.adsLinks) {
        // Add Google Ads link fields.
        deleteOrArchive = entity[11];
        create = entity[12];
        const canManageClients = entity[6];
        const adsPersonalizationEnabled = entity[7];
        payload.customerId = entityDisplayNameOrId;
        payload.canManageClients = canManageClients;
        payload.adsPersonalizationEnabled = adsPersonalizationEnabled;
      } else if (sheetName == sheetNames.ga4.firebaseLinks) {
        // Add Firebase link fields.
        deleteOrArchive = entity[8];
        create = entity[9];
        const maximumUserAccess = entity[7];
        payload.project = entityDisplayNameOrId;
        payload.maximumUserAccess = maximumUserAccess;
      }

      // An entity cannot be both created and archived/deleted, so if both
      // are true, then the response is null and row is marked as skipped.
      if (deleteOrArchive && create) {
        actionTaken = apiActionTaken.ga4.skipped;
        // Writes that the entity was skipped to the sheet.
        writeGA4ActionTakenToSheet(sheetName, index, actionTaken);
      // Archives custom definitions and deletes anything else that can be deleted.
      } else if (deleteOrArchive) {
        if (
          sheetName == sheetNames.ga4.customDimensions ||
          sheetName == sheetNames.ga4.customMetrics) {
          response = archiveGA4CustomDefinition(entityPath);
          if (response.length == undefined) {
            actionTaken = apiActionTaken.ga4.archived;
          } else {
            actionTaken = apiActionTaken.ga4.error;
          }
        } else {
          response = deleteGA4Entity(entityPath);
          if (response.length == undefined) {
            actionTaken = apiActionTaken.ga4.deleted;
          } else {
            actionTaken = apiActionTaken.ga4.error;
          }
        }
        // Writes that the entity was deleted or archived to the sheet.
        writeGA4ActionTakenToSheet(sheetName, index, actionTaken);

      // Creates the new entity.
      } else if (create) {
        if (sheetName == sheetNames.ga4.customDimensions) {
          response = createGA4Entity(propertyPath + ga4RequestSuffix.customDimensions, payload);
        } else if (sheetName == sheetNames.ga4.customMetrics) {
          response = createGA4Entity(propertyPath + ga4RequestSuffix.customMetrics, payload);
        } else if (sheetName == sheetNames.ga4.conversionEvents) {
          response = createGA4Entity(propertyPath + ga4RequestSuffix.conversionEvents, payload);
        } else if (sheetName == sheetNames.ga4.adsLinks) {
          response = createGA4Entity(propertyPath + ga4RequestSuffix.googleAdsLinks, payload);
        } else if (sheetName == sheetNames.ga4.firebaseLinks) {
          response = createGA4Entity(propertyPath + ga4RequestSuffix.firebaseLinks, payload);
        }
        // Writes the creation of the entity to the sheet.
        writeGA4ActionTakenToSheet(sheetName, index, apiActionTaken.ga4.created);
      }
    });
  }
}

/**
 * Writes the action that was taken on a GA4 enity to a sheet.
 * @param {string} sheetName The name of the sheet being written to.
 * @param {number} index The index of the entity that is being acted
 * upon in the two dimensional array of entity data.
 * @param {string} status The action taken for a given entity.
 */
function writeGA4ActionTakenToSheet(sheetName, index, actionTaken) {
	// The actual row to be written to is offset from the index value by 2, so
	// the index value must be increased by two.
	const writeRow = index + 2; 
  let actionTakenColumn = null;
  // The action taken column number will be correctly set below;
  if (sheetName == sheetNames.ga4.customDimensions) {
    actionTakenColumn = sheetRanges.ga4.customDimensions.read.numColumns;
  } else if (sheetName == sheetNames.ga4.customMetrics) {
    actionTakenColumn = sheetRanges.ga4.customMetrics.read.numColumns;
  } else if (sheetName == sheetNames.ga4.conversionEvents) {
    actionTakenColumn = sheetRanges.ga4.conversionEvents.read.numColumns;
  } else if (sheetName == sheetNames.ga4.adsLinks) {
    actionTakenColumn = sheetRanges.ga4.adsLinks.read.numColumns;
  } else if (sheetName == sheetNames.ga4.firebaseLinks) {
    actionTakenColumn = sheetRanges.ga4.firebaseLinks.read.numColumns;
  }
	const numRows = 1;
	const numColumns = 1;
	ss.getSheetByName(sheetName).getRange(
		writeRow, actionTakenColumn, numRows, numColumns
	).setValue(actionTaken);
}