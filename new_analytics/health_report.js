/**
 * Copyright 2024 Google LLC
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
 * Creates the GA4 health report by pulling information for each of the report
 * components and saving that datat to their respective sheets. The settings
 * data for both the aggregate slides and snapshot slides is then formatted and
 * looped through to build a new Google Slides presentation where placeholders
 * are replaced with new values.
 */
function createHealthReport() {
  if (SpreadsheetApp.getActive()
  .getSheetByName(sheetsMeta.ga4.healthReport.sheetName)
  .getRange('C8').getValue()) {
    listAllGA4PropertyResources();
  }

  const healthReportSettings = formatHealthReportSettings();

  const presentationTemplate = createNewPresentation(
    healthReportSettings.templateUrl,
    healthReportSettings.emails,
    healthReportSettings.access);
  presentationTemplate.setName(healthReportSettings.reportName);
  setReportListValue(
    healthReportSettings.reportName, presentationTemplate.getUrl());

  if (healthReportSettings.templateInfo.length > 0) {
    healthReportSettings.templateInfo.forEach(templateInfo => {
      replaceSingleSlidePlaceholders(
        presentationTemplate,
        templateInfo,
        healthReportSettings.percentColorRanges);
    });
  }
  createRepeatingSlides(
    presentationTemplate,
    healthReportSettings.percentColorRanges);
}

/**
 * Creates new Google Slides presentation and shares it based on provided
 * settings.
 * @param {string} templateUrl
 * @param {string} emailString
 * @param {string} access
 * @return {!Object} The presentation object.
 */
function createNewPresentation(templateUrl, emailString, access) {
  let presentationTemplate = '';
  if (templateUrl == 'Default') {
    presentationTemplateId = DriveApp.getFileById(
      '1FikbCtbaU4BLqH8477wpFHCLDUMWalnnWW1VSchsR1s').makeCopy().getId();
    presentationTemplate = SlidesApp.openById(presentationTemplateId);
  } else {
    presentationTemplateId = DriveApp.getFileById(templateUrl.split('/')[5])
    .makeCopy().getId();
    presentationTemplate = SlidesApp.openById(presentationTemplateId);
  }

  if (emailString.length > 0) {
    const emailArray = emailString.split(',').map(email => email.trim());
    if (access == 'View') {
      presentationTemplate.addViewers(emailArray);
    } else if (access == 'Comment') {
      presentationTemplate.addCommenters(emailArray);
    } else if (access == 'Edit') {
      presentationTemplate.addEditors(emailArray);
    }
  }
  return presentationTemplate;
}

/**
 * Sets report URL and date created in the sheet.
 * @param {string} reportName
 * @param {string} reportUrl
 */
function setReportListValue(reportName, reportUrl) {
  const richTextValue = SpreadsheetApp.newRichTextValue().setText(reportName)
  .setLinkUrl(reportUrl).build();
  const reportSheet = SpreadsheetApp.getActive()
  .getSheetByName(sheetsMeta.ga4.healthReport.sheetName);
  const reportRange = SpreadsheetApp.getActive()
  .getSheetByName(sheetsMeta.ga4.healthReport.sheetName)
    .getRange(3, 6, reportSheet.getLastRow(),1);
  const reportValues = reportRange.getValues();
  let firstBlankCellIndex = reportValues.flat().indexOf('');
  if (firstBlankCellIndex + 2 == reportSheet.getLastRow()) {
    reportSheet.insertRowAfter(reportSheet.getLastRow());
  }
  reportSheet.getRange(firstBlankCellIndex + 3, 6, 1, 1)
  .setRichTextValue(richTextValue);
  reportSheet.getRange(firstBlankCellIndex + 3, 7, 1, 1).setValue(new Date());
}

/**
 * Returns the name for a given field based on the supplied index.
 * @param {!number} index The index for setting.
 * @return {!string} The field name.
 */
function getSettingsKeyName(index) {
  switch (index) {
    case 0:
      return 'reportName';
    case 1:
      return 'templateUrl';
    case 2:
      return 'emails'
    case 3:
      return 'access'
    case 4:
      return 'pullData';
    case 5:
      return 'percentColorRanges'
    case 6:
      return 'trueColor';
    case 7:
      return 'falseColor';
  }
}

/**
 * Retrieves data from the Report Settings sheet and formats it to be
 * useable when replacing values in the slides.
 * @returns {!Object} The health report settings object.
 */
function formatHealthReportSettings() {
  const settings = getDataFromSheet(sheetsMeta.ga4.healthReport.sheetName);
  const blankRowIndex = settings.findIndex(settingRow => settingRow[0] == '');

  // Creates general settings.
  const generalRows = settings.slice(0, blankRowIndex);
  const generalSettings = generalRows.reduce((obj, settingRow, index) => {
    const key = getSettingsKeyName(index);
    const value = settingRow[2];
    if (index != 5) {
      obj[key] = value;
    } else if (index == 5 && value.length > 0) {
      obj[key] = formatColorRangeObject(value);
    }
    return obj;
  }, {});

  // Creates template settings.
  const templateRows = settings.slice(blankRowIndex + 2);
  const templateSettings = templateRows.reduce((obj, settingRow) => {
  // Starts constructing template objects.
    const templatePlaceholder = settingRow[0]
    const templateSlideId = settingRow[1];
    const include = settingRow[2];
    const templateValue = settingRow[3];
    if (include) {
      const placeholderValuePair = {};
      placeholderValuePair[templatePlaceholder] = templateValue;
      // Checks if there is no templateInfo field.
      if (obj.templateInfo == undefined) {
        // Creates the templateInfo field and adds the first object.
        obj.templateInfo = [{
          templateSlideId: templateSlideId,
          templatePairs: [placeholderValuePair]
        }];
      } else {
        // Checks if a template slide ID already exists in the templateInfo
        // object.
        if(obj.templateInfo.find(
          template => template.templateSlideId == templateSlideId)) {
          // Adds the new placeholder/value pair object to the templatePairs
          // array.
          const templateObj = obj.templateInfo.find(
            template => template.templateSlideId == templateSlideId);
          const existingPair = templateObj.templatePairs.find(
            pair => Object.keys(pair)[0] == templatePlaceholder);
          if (/list/.test(templatePlaceholder) && existingPair != undefined) {
            existingPair[templatePlaceholder] += (';;' + templateValue);
          } else {
            templateObj.templatePairs.push(placeholderValuePair);
          }
        } else {
          // Creates a new templateInfo object with the template slid ID and the
          // first placeholder/value pair.
          obj.templateInfo.push({
            templateSlideId: templateSlideId,
            templatePairs: [placeholderValuePair]
          });
        }
      }
    }
    return obj;
  }, {});
  return {...generalSettings, ...templateSettings};
}

/**
 * Creates the repeating slides, which are multiple slides within the larger
 * presentation that follow a set template. This process creates a new slide
 * based on a template slide and then replaces the placeholders with real values
 * in the new template slide copy.
 * @param {!Object} presentation
 * @param {!Array} percentColorRanges
 */
function createRepeatingSlides(presentation, percentColorRanges) {
  // Gets snapshot sheet.
  const snapshotSheet = SpreadsheetApp.getActiveSpreadsheet()
  .getSheetByName('Report Settings - Snapshot');
  // Gets data from the snapshot sheet.
  const snapshotData = snapshotSheet.getRange(
    1, 1, snapshotSheet.getLastRow(), snapshotSheet.getLastColumn()
  ).getValues();
  const templateSlideIds = [];

  // Checks if more than just the headers exists for the snapshot data.
  if (snapshotData.length > 1) {
    // Loops through the snapshoot data starting at index 1 to skip the headers.
    for (let index = 1; index < snapshotData.length; index++) {
      const placeholders = snapshotData[0];
      const values = snapshotData[index];
      const templateSlideId = values[1]
      if (templateSlideIds.indexOf(templateSlideId) == -1) {
        templateSlideIds.push(templateSlideId);
      }
      // Finds the template slide in the presentation
      const templateSlide = presentation.getSlides().find(
        slide => slide.getNotesPage().getSpeakerNotesShape().getText()
        .asString().trim() == templateSlideId);
      // Makes a copy of the template slide
      if (templateSlide != undefined) {
        const templateSlideCopy = templateSlide.duplicate();
        // Removes the text in the notes page in the copy.
        templateSlideCopy.getNotesPage().replaceAllText(templateSlideId, '');

        const shapes = templateSlideCopy.getShapes();
        // Loop through the placeholders and the values to replace the values.
        if (placeholders.length > 2) {
          for (let j = 2; j < placeholders.length; j++) {
            const placeholder = placeholders[j];
            const value = values[j];
            const selectedShape = shapes.find(shape => shape.getText()
            .find(placeholder).length > 0);
            replaceValues(placeholder, value, selectedShape, percentColorRanges);
          }
        }
      }
    }
  }
  // Removes original template slides.
  if (templateSlideIds.length > 0) {
    templateSlideIds.forEach(templateSlideId => {
      const templateSlide = presentation.getSlides().find(
        slide => slide.getNotesPage().getSpeakerNotesShape().getText()
        .asString().trim() == templateSlideId);
      templateSlide.remove();
    });
  }
}

/**
 * Replaces the placeholder with an unordered list of values.
 * @param {!string} templateValue
 * @param {!string} templatePlaceholder
 * @param {!Object} textRange
 * @param {!string} percentColorRanges
 */
function replaceWithList(
  templateValue, templatePlaceholder,
  textRange, percentColorRanges) {
  const listBullets = templateValue.split(';;');
  if (listBullets.length > 0) {
    if (listBullets[listBullets.length - 1] == '') {
      listBullets.pop();
    }
    for (let k = 0; k < listBullets.length; k++) {
      if (k == 0) {
        replaceWithTextOrNumber(
          textRange, templatePlaceholder, listBullets[k], percentColorRanges)
        .getListStyle().applyListPreset(
          SlidesApp.ListPreset.DISC_CIRCLE_SQUARE);
      } else {
        textRange.appendParagraph(listBullets[k])
        .getRange().getListStyle().applyListPreset(
          SlidesApp.ListPreset.DISC_CIRCLE_SQUARE);
      }
    }
  }
}

/**
 * Converts the color range string from the sheet from a string to an object.
 * @param {!string} value The string value that needs to be reformatted.
 * @return {!Object} The color range object.
 */
function formatColorRangeObject(value) {
  return value.split(';').reduce((arr, range) => {
    arr.push({
      start: range.split(',')[0].split('-')[0],
      end: range.split(',')[0].split('-')[1],
      hex: range.split(',')[1]
    });
    return arr;
  }, []);
}

/**
 * Finds the template slides and replaces their content with values from the
 * sheet.
 * @param {!Object} presentation The Google Slides presentation.
 * @param {!Object} templateInfo The the template info object.
 * @param {!Object} percentColorRanges The color ranges for percent values
 * object.
 */
function replaceSingleSlidePlaceholders(
  presentation, templateInfo, percentColorRanges) {
  // Gets the template slide.
  const templateSlide = presentation.getSlides().find(
    slide => slide.getNotesPage().getSpeakerNotesShape().getText().asString()
    .trim() == templateInfo.templateSlideId);

  // Get the shapes in the template slide.
  const shapes = templateSlide.getShapes();

  // Loop through the template pairs.
  for (let index = 0; index < templateInfo.templatePairs.length; index++) {
    const templatePair = templateInfo.templatePairs[index];
    const templatePlaceholder = Object.keys(templatePair)[0];
    const templateValue = templatePair[templatePlaceholder];
    const selectedShape = shapes.find(
      element => element.getText().asString().trim() == templatePlaceholder);
    if (selectedShape != undefined &&
      /logo|image|graphic/.test(templatePlaceholder)) {
      shapes.splice(shapes.indexOf(selectedShape), 1);
    }
    replaceValues(templatePlaceholder, templateValue,
    selectedShape, percentColorRanges);
  }
}

/**
 * Replaces the placeholder values in the slide with the values from the sheet.
 * @param {!string} placeholder The placeholder string to be replaced.
 * @param {!value} value The string value to replace the placeholder string.
 * @param {!Object} shape The slide shape with the placeholder string.
 * @param {!Object} percentColorRanges The color ranges for percent values
 * object.
 */
function replaceValues(placeholder, value, shape, percentColorRanges) {
  if (shape != undefined) {
    // Gets the text from the template slide shape.
    const textRange = shape.getText();

    // Checks if the placeholder value is present in the template slide shape
    // text.
    if (textRange.find(placeholder).length > 0) {
      // Replaces the placeholder shape with an image with the same dimensions.
      if (/logo|image|graphic/.test(placeholder)) {
        replaceTemplateWithImage(shape, value);
      } else if (/list/.test(placeholder)) {
        replaceWithList(value, placeholder, textRange, percentColorRanges);
      } else {
        // Replaces the placholder text with the actual text.
        replaceWithTextOrNumber(
          textRange, placeholder,
          value, percentColorRanges);
      }
    }
  }
}

/**
 * Replaces the placeholder template string with an image.
 * @param {!Object} shape The shape to be replaced.
 * @param {!string} templateValue The URL for the image.
 */
function replaceTemplateWithImage(shape, templateValue) {
  const height = shape.getHeight();
  const width = shape.getWidth();
  if (templateValue.length > 0) {
    shape.replaceWithImage(templateValue).setHeight(height).setWidth(width);
  }
}

/**
 * Replaces the placeholder template string with the new value from the sheet.
 * This value from the sheet can be either a string or a number. If it is a
 * number, it is transformed into a string.
 * @param {!Object} textRange The text range that contains the placeholder
 * string.
 * @param {!string} templatePlaceholder The placeholder string to be replaced.
 * @param {!string} templateValue The value from the sheet that will replace the
 * placeholder string.
 * @param {!Object} percentColorRanges The color ranges for percent values
 * object.
 */
function replaceWithTextOrNumber(
  textRange, templatePlaceholder, templateValue, percentColorRanges) {
  // Sets the percent color.
  if (/percent/.test(templatePlaceholder)) {
    // Converts the decimal to a percent.
    const percentNumValue = Math.round(parseFloat(templateValue) * 100);
    // Converts the percent to a string with the percent sign at the end.
    const percentStringValue = percentNumValue.toString() + '%';
    // Replaces the placeholder in the slide with the percent string value.
    textRange.replaceAllText(templatePlaceholder.trim(), percentStringValue);
    // Gets the range of the replaced value in order to change its color.
    const percentTextRanges = textRange.find(percentStringValue);
    // Loops through the percent color range values to set the color of the
    // replaced value correctly.
    percentTextRanges.forEach(percentTextRange => {
      if (percentColorRanges.length > 0) {
        percentColorRanges.forEach(range => {
          if (percentNumValue >= parseInt(range.start) &&
          percentNumValue <= parseInt(range.end)) {
            percentTextRange.getTextStyle().setForegroundColor(range.hex);
          }
        });
      }
    });
  } else if (!isNaN(templateValue) && typeof templateValue != "boolean") {
    // Rounds any potential float to the nearest integer to display the value
    // more clearly on the slide.
    const numValue = Math.round(parseFloat(templateValue));
    textRange.replaceAllText(templatePlaceholder.trim(), numValue);
  } else {
    // Replaces the placeholder with a non-numeric value.
    textRange.replaceAllText(templatePlaceholder.trim(), templateValue);
  }
  return textRange;
}