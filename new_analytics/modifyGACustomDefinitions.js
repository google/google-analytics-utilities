/**
 * Archives or creates GA4 custom dimensions.
 */
function modifyGA4CustomDimensions() {
  modifyGA4CustomDefinitions(requestType.ga4.cd);
}

/**
 * Archives or creates GA4 custom metrics.
 */
function modifyGA4CustomMetrics() {
  modifyGA4CustomDefinitions(requestType.ga4.cm);
}

/**
 * Loops through a list of custom dimensions or metrics and either creates or
 * archives the custom dimensions based on the information in the sheet.
 * @param {string} type Either custom dimensions or custom metrics.
 */
function modifyGA4CustomDefinitions(type) {
  let sheetName = null;
  if (type == requestType.ga4.cd) {
    sheetName = sheetNames.ga4.customDimensions;
  } else if (type == requestType.ga4.cm) {
    sheetName = sheetNames.ga4.customMetrics;
  }
  let customDefinitions = getDataFromSheet(sheetName);
  customDefinitions = customDefinitions.filter(
		definition => definition[0] != '');
  if (customDefinitions.length > 0) {
    customDefinitions.forEach((definition, index) => {
      let response = null;
			const propertyId = definition[3];
			const displayName = definition[4];
			const parameterName = definition[5];
			const customDefinitionPath = definition[6];
			const scope = definition[7];
			const description = definition[9];
			const toBeArchived = definition[10];
			const toBeCreated = definition[11];
      if (toBeArchived && toBeCreated) {
				// A custom definition cannot be both created and archived, so if both
				// are true, then the response is null and row is marked as skipped.
        writeGA4CustomDefinitionStatusToSheet(sheetName, response, index);
      } else if (toBeArchived) {
        if (type == requestType.ga4.cd) {
          response = archiveGA4CustomDimension(customDefinitionPath);
        } else if (type == requestType.ga4.cm) {
          response = archiveGA4CustomMetric(customDefinitionPath);
        }
        writeGA4CustomDefinitionStatusToSheet(sheetName, response, index);
      } else if (toBeCreated) {
        const data = {
          payload: {
            displayName: displayName,
            parameterName: parameterName,
            scope: scope,
            description: description
          }
        };
        if (type == requestType.ga4.cd) {
					const disallowAdsPersonalization = definition[8];
          data.payload.disallowAdsPersonalization = 
					disallowAdsPersonalization || false;
          response = createGA4CustomDimension(
						'properties/' + propertyId, data
					);
        } else if (type == requestType.ga4.cm) {
					const measurementUnit = definition[8];
          data.payload.measurementUnit = measurementUnit;
          response = createGA4CustomMetric('properties/' + propertyId, data);
        }
        writeGA4CustomDefinitionStatusToSheet(sheetName, response, index);
      }
    });
  }
}

/**
 * Writes the action that was taken on a GA4 custom definition to a sheet.
 * @param {string} sheetName
 * @param {?Object|null} response
 * @param {number} index The index of the custom definition that is being acted
 * upon in the two dimensional array of custom definition data.
 */
function writeGA4CustomDefinitionStatusToSheet(sheetName, response, index) {
  let status = null;
  if (response != null) {
    if (response.getResponseCode() == 200) {
      if (Object.keys(JSON.parse(response.getContentText())).length === 0) {
        status = 'Archived';
      } else {
        status = 'Created';
      }
    } else {
      console.log(response);
      status = 'Error';
    }
  } else {
    status = 'Skipped';
  }
	// The actual row to be written to is offset from the index value by 2, so
	// the index value must be increased by two.
	const writeRow = index + 2; 
  
	const statusColumn = 13; // The status column should always be column 13.
	const numRows = 1;
	const numColumns = 1;
	ss.getSheetByName(sheetName).getRange(
		writeRow, statusColumn, numRows, numColumns
	).setValue(status);
}