/**
 * Write an array of all properties to the sheet.
 * @param {string} sheetName The name of the sheet where the data will
 * be written.
 * @param {string} rangeName The range for the given sheet were the data
 * will be written.
 */
function writeDestinationPropertiesToSheet(sheetName, rangeName) {
  const allProperties = getAllProperties();
  allProperties.forEach(property => property.push(false));
  const range = ss.getSheetByName(sheetName).getRange(
    rangeName.write.row,
    rangeName.write.column,
    allProperties.length,
    rangeName.write.numColumns
  );
  range.setValues(allProperties);
}

/**
 * Either creates new or updates existing custom definitions for selected
 * Universal Analytics properties.
 * @param {string} sheetName The name of the sheet where the information exists.
 * @param {!Object} templateValuesRange The range of the template custom definitions
 * on the sheet.
 * @param {!Object} destinationPropertyRange The range of the destination properties
 * on the sheet.
 * @param {!Object} settingsRange The range for the settings on the sheet.
 * @param {string} type Either custom dimensions or custom metrics.
 */
function modifyUACustomDefinitions(
  sheetName, templateValuesRange, destinationPropertyRange, settingsRange, type) {
  const modifyCustomDefinitionSheet = ss.getSheetByName(sheetName);
  let selectedDestinationProperties = modifyCustomDefinitionSheet.getRange(
    destinationPropertyRange.read.row,
    destinationPropertyRange.read.column,
    modifyCustomDefinitionSheet.getLastRow(),
    destinationPropertyRange.read.numColumns
  ).getValues();
  selectedDestinationProperties = selectedDestinationProperties.filter(row => row[5] == true);
  let templateValues = modifyCustomDefinitionSheet.getRange(
    templateValuesRange.read.row,
    templateValuesRange.read.column,
    modifyCustomDefinitionSheet.getLastRow(),
    templateValuesRange.read.numColumns
  ).getValues();
  templateValues = templateValues.filter(row => row[0] != '');
  const modifySettings = modifyCustomDefinitionSheet.getRange(
    settingsRange.read.row,
    settingsRange.read.column,
    settingsRange.read.numRows,
    settingsRange.read.numColumns
  ).getValues();
  const overwriteExisting = modifySettings[0][0];
  if (templateValues.length > 0 && selectedDestinationProperties.length > 0) {
    selectedDestinationProperties.forEach(property => {
      const existingDestinationValues = getCustomDimensions(property[1], property[3]);
      for (let i = 0; i < templateValues.length; i++) {
        if (!property[5] && i > 19) {
          break;
        }
        const templateValue = templateValues[i];
        const existingValue = existingDestinationValues[i];
        const templateRequest = {
          accountId: property[1],
          propertyId: property[3],
          index: templateValue[0],
          body: {
            name: templateValue[1],
            scope: templateValue[2],
            active: templateValue[3]
          }
        };
        let placeholderName = modifySettings[1][0];
        if (placeholderName == '') {
          placeholderName = 'Placeholder';
        }
        const placeholderRequest = {
          accountId: property[1],
          propertyId: property[3],
          index: templateValue[0],
          body: {
            name:  placeholderName + ' ' + templateValue[0],
            scope: modifySettings[2][0],
            active: modifySettings[3][0]
          }
        };
        if (type == 'custom metrics') {
          templateRequest.body.minValue = templateValue[4];
          templateRequest.body.maxValue = templateValue[5];
          templateRequest.body.type = templateValue[6];
          placeholderRequest.body.minValue = modifySettings[4][0];
          placeholderRequest.body.maxValue = modifySettings[5][0];
          placeholderRequest.body.type = modifySettings[6][0];
        }
        if (existingValue != undefined) {
          if (templateValue[templateValue.length - 1]) {
            if (overwriteExisting) {
              if (templateValue[1] != existingValue.name ||
              templateValue[2] != existingValue.scope ||
              templateValue[3] != existingValue.active) {
                let response = null;
                let resultsSheetName = '';
                let resultsRange = {};
                if (type == 'custom dimensions') {
                  response = updateCustomDimension(templateRequest);
                  resultsSheetName = sheetNames.ua.modifyCdsResults;
                  resultsRange = sheetRanges.ua.modifyCdsResults;
                } else if (type == 'custom metrics' && 
                templateValue[4] != existingValue.min_value &&
                templateValue[5] != existingValue.max_value &&
                templateValue[6] != existingValue.type) {
                  response = updateCustomMetric(templateRequest);
                  resultsSheetName = sheetNames.ua.modifyCmsResults;
                  resultsRange = sheetRanges.ua.modifyCmsResults;
                }
                writeUACustomDefinitionModificationToSheet(
                  type, response, property[1], property[3], 'created',
                  resultsSheetName, resultsRange);
                Utilities.sleep(750);
              }
            }
          }
        } else {
          if (templateCd[4]) {
            let response = null;
            let resultsSheetName = '';
            let resultsRange = {};
            if (type == 'custom dimensions') {
              response = createCustomDimension(templateRequest);
              resultsSheetName = sheetNames.ua.modifyCdsResults;
              resultsRange = sheetRanges.ua.modifyCdsResults;
            } else if (type == 'custom metrics') {
              response = createCustomMetric(templateRequest);
              resultsSheetName = sheetNames.ua.modifyCmsResults;
              resultsRange = sheetRanges.ua.modifyCmsResults;
            }
            writeUACustomDefinitionModificationToSheet(
              type, response, property[1], property[3], 'created',
              resultsSheetName, resultsRange);
            Utilities.sleep(750);
          } else {
            let response = null;
            let resultsSheetName = '';
            let resultsRange = {};
            if (type == 'custom dimensions') {
              response = createCustomDimension(placeholderRequest);
              resultsSheetName = sheetNames.ua.modifyCdsResults;
              resultsRange = sheetRanges.ua.modifyCdsResults;
            } else if (type == 'custom metrics') {
              response = createCustomMetric(placeholderRequest);
              resultsSheetName = sheetNames.ua.modifyCmsResults;
              resultsRange = sheetRanges.ua.modifyCmsResults;
            }
            writeUACustomDefinitionModificationToSheet(
              type, response, property[1], property[3], 'created',
              resultsSheetName, resultsRange);
            Utilities.sleep(750);
          }
        }
      }
    });
  }
}

/**
 * Write template property custom dimensions to sheet.
 * @param {string} sheetName
 * @param {!Object} templatePropertyRange
 * @param {!Object} templateValuesRange
 * @param {string} type
 */
function writeTemplateCustomDefinitionsToSheet(
  sheetName, templatePropertyRange, templateValuesRange, type) {
  const sheet = ss.getSheetByName(sheetName);
  // Get template IDs from the sheet.
  const ids = sheet.getRange(
    templatePropertyRange.read.row,
    templatePropertyRange.read.column,
    templatePropertyRange.read.numRows,
    templatePropertyRange.read.numColumns
  ).getValues();
  // Get the template property custom dimensions.
  let definitions = null;
  if (type == 'custom dimensions') {
    definitions = listCustomDimensions(ids[0][1], ids[0][3]);
  } else if (type == 'custom metrics') {
    definitions = listCustomMetrics(ids[0][1], ids[0][3]);
  }
  if (definitions.length > 0) {
    // Remove the account ID and property ID for each definition.
    definitions.forEach(definition => {
      definition.shift();
      definition.shift();
    });
    const range = sheet.getRange(
      templateValuesRange.write.row,
      templateValuesRange.write.column,
      definitions.length,
      templateValuesRange.write.numColumns
    );
    range.setValues(definitions);
  }
}

/**
 * Write the results of modifying a UA custom dimension or metric to a sheet.
 * @param {string} type Either custom dimensions or custom metrics.
 * @param {!Object} values The UA custom metric or dimension after it has been modified.
 * @param {number} accountId The account ID for the custom metric or dimension.
 * @param {string} propertyId The property ID for the custom metric or dimension.
 * @param {string} actionTaken The action taken on the custom metric or dimension.
 * @param {string} sheetName The sheet name where the results will be written.
 * @param {!Object} sheetRange The range where the results will be written.
 */
function writeUACustomDefinitionModificationToSheet(
  type, values, accountId, propertyId, actionTaken, sheetName, sheetRange) {
  const result = [];
  const date = new Date();
  if (type == 'custom dimensions') {
    result.push([
      accountId, propertyId,
      values.index, values.name, values.scope, values.active,
      actionTaken, date
    ]);
  } else if (type == 'custom metrics') {
    result.push([
      accountId, propertyId,
      values.index, values.name, values.scope, values.active,
      values.min_value, values.max_value, values.type,
      actionTaken, date
    ]);
  }
  ss.getSheetByName(sheetName).getRange(
    ss.getSheetByName(sheetName).getLastRow() + 1, 
    sheetRange.write.column, 1,
    sheetRange.write.numColumns).setValues(result);
}

/**
 * Write an array of all properties to the sheet Custom Dimension - Modify sheet.
 */
function writeCustomDimensionDestinationPropertiesToSheet() {
  writeDestinationPropertiesToSheet(
    sheetNames.ua.modifyCds,
    sheetRanges.ua.modifyCdsDestinationProperties
  );
}

/**
 * Write an array of custom dimensions to the Custom Dimension - Modify Sheet.
 */
function writeTemplateCustomDimensionsToSheet() {
  writeTemplateCustomDefinitionsToSheet(
    sheetNames.ua.modifyCds,
    sheetRanges.ua.modifyCdsTemplateProperty,
    sheetRanges.ua.modifyCdsTemplateDimensions, 
    'custom dimensions'
  );
}

/**
 * Modify custom dimensions for the selected destination properties.
 */
function modifyCustomDimensions() {
  modifyUACustomDefinitions(sheetNames.ua.modifyCds, sheetRanges.ua.modifyCdsTemplateDimensions,
  sheetRanges.ua.modifyCdsDestinationProperties, sheetRanges.ua.modifyCdsSettings, 'custom dimensions');
}

/**
 * Write an array of all properties to the sheet Custom Metrics - Modify sheet.
 */
function writeCustomMetricDestinationPropertiesToSheet() {
  writeDestinationPropertiesToSheet(
    sheetNames.ua.modifyCms,
    sheetRanges.ua.modifyCmsDestinationProperties
  );
}

/**
 * Write an array of custom metrics to the Custom Metrics - Modify Sheet.
 */
function writeTemplateCustomMetricsToSheet() {
  writeTemplateCustomDefinitionsToSheet(
    sheetNames.ua.modifyCms,
    sheetRanges.ua.modifyCmsTemplateProperty,
    sheetRanges.ua.modifyCmsTemplateMetrics, 
    'custom metrics'
  );
}

/**
 * Modify custom metrics for the selected destination properties.
 */
function modifyCustomMetrics() {
  modifyUACustomDefinitions(sheetNames.ua.modifyCms, sheetRanges.ua.modifyCmsTemplateMetrics,
  sheetRanges.ua.modifyCmsDestinationProperties, sheetRanges.ua.modifyCmsSettings, 'custom metrics');
}