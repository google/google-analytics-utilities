/**
 * Copyright 2023 Google LLC
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
 * 
 */
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Gets the GA4 settings for the features for an array of properties and returns
 * a double array.
 * @param {!Array<!Object>} properties
 */
function listAllFeatureSettings(properties) {
  const data = [];
  if (properties.length > 0) {
    properties.forEach(property => {
      const accountName = property[0];
      const accountId = property[1];
      const propertyName = property[2];
      const propertyId = property[3];
      const propertyResourceName = 'properties/' + propertyId;
      const attributionSettings = AnalyticsAdmin.Properties
        .getAttributionSettings(propertyResourceName + '/attributionSettings');
      const dataRetentionSettings = AnalyticsAdmin.Properties.
        getGoogleSignalsSettings(
          propertyResourceName + '/dataRetentionSettings');
      data.push([
        accountName,
        accountId,
        propertyName,
        propertyId,
        '', '',
        JSON.stringify(cleanOutput('properties',
          getGA4Resource('properties', propertyResourceName)), null, 2),
        JSON.stringify(cleanOutput(
          'data retention',dataRetentionSettings), null, 2),
        JSON.stringify(cleanOutput(
          'attribution', attributionSettings), null, 2),
        JSON.stringify(cleanOutput('audiences',
          listGA4Entities('audiences', propertyResourceName).audiences), null, 2) || '[]',
        JSON.stringify(cleanOutput('streams',
          listGA4Entities('streams', propertyResourceName).dataStreams), null, 2) || '[]',
        JSON.stringify(cleanOutput('customDimensions',
          listGA4Entities('customDimensions', propertyResourceName).customDimensions), null, 2) || '[]',
        JSON.stringify(cleanOutput('customMetrics',
          listGA4Entities('customMetrics', propertyResourceName).customMetrics), null, 2) || '[]',
        JSON.stringify(cleanOutput('conversionEvents',
          listGA4Entities('conversionEvents', propertyResourceName).conversionEvents), null, 2) || '[]',
        JSON.stringify(cleanOutput('googleAdsLinks',
          listGA4Entities('googleAdsLinks', propertyResourceName).googleAdsLinks), null, 2) || '[]',
        JSON.stringify(cleanOutput('displayVideo360AdvertiserLinks',
          listGA4Entities(
            'displayVideo360AdvertiserLinks', propertyResourceName).displayVideo360AdvertiserLinks), null, 2) || '[]',
        JSON.stringify(cleanOutput('searchAds360Links',
          listGA4Entities('searchAds360Links', propertyResourceName).searchAds360Links), null, 2) || '[]',
        JSON.stringify(cleanOutput('firebaseLinks',
          listGA4Entities('firebaseLinks', propertyResourceName).firebaseLinks), null, 2) || '[]'
      ]);
    });
  }
  return data;
}

/**
 * Removes unnecessary fields from the various resources.
 */
function cleanOutput(resourceType, value) {
  if (resourceType == 'properties') {
    delete value.updateTime;
    delete value.createTime;
    delete value.displayName;
    delete value.account;
    delete value.parent;
    delete value.serviceLevel;
    delete value.name;
    delete value.propertyType;
  } else if (resourceType == 'data retention') {
    delete value.name;
  } else if (resourceType == 'attribution') {
    delete value.name;
  } else if (resourceType == 'audiences') {
    if (value != undefined) {
      const defaultAudienceNames = ['All Users', 'Purchasers'];
      defaultAudienceNames.forEach(defaultName => {
        const index = value.findIndex(aud => aud.displayName == defaultName);
        if (index > -1) {
          value.splice(index, 1);
        }
      });
      value.forEach(audience => {
        delete audience.name;
        if (audience.description == undefined) {
          audience.description = audience.displayName;
        }
        if (isEmptyObject(audience.eventTrigger)) {
          delete audience.eventTrigger;
        }
      });
    }
  } else if (resourceType == 'streams') {
    if (value != undefined) {
      value.forEach(stream => {
        delete stream.name;
        delete stream.updateTime;
        delete stream.createTime;
        if (stream.webStreamData) {
          delete stream.webStreamData.measurementId;
        }
      });
    }
  } else if (resourceType == 'customDimensions') {
    if (value != undefined) {
      value.forEach(dimension => {
        delete dimension.name;
      });
    }
  } else if (resourceType == 'customMetrics') {
    if (value != undefined) {
      value.forEach(metric => {
        delete metric.name;
      });
    }
  } else if (resourceType == 'conversionEvents') {
    if (value != undefined) {
      const defaultConversions = [
        'app_store_subscription_convert',
        'app_store_subscription_renew',
        'ecommerce_purchase',
        'first_open',
        'in_app_purchase',
        'purchase'
      ];
      defaultConversions.forEach(defaultConversion => {
        const index = value.findIndex(
          conversion => conversion.eventName == defaultConversion);
        if (index > -1) {
          value.splice(index, 1);
        }
      });
      if (value != undefined) {
        value.forEach(conversion => {
          delete conversion.name;
          delete conversion.createTime;
          delete conversion.deletable;
        });
      }
    }
  } else if (resourceType == 'googleAdsLinks') {
    if (value != undefined) {
      value.forEach(link => {
        delete link.name;
        delete link.canManageClients;
        delete link.createTime;
        delete link.updateTime;
        delete link.creatorEmailAddress;
      });
    }
  } else if (resourceType == 'displayVideo360AdvertiserLinks') {
    if (value != undefined) {
      value.forEach(link => {
        delete link.name;
        delete link.advertiserDisplayName;
      });
    }
  } else if (resourceType == 'searchAds360Links') {
    if (value != undefined) {
      value.forEach(link => {
        delete link.name;
        delete link.advertiserDisplayName;
      });
    }
  } else if (resourceType == 'firebaseLinks') {
    if (value != undefined) {
      value.forEach(link => {
        delete link.name;
        delete link.createTime;
      });
    }
  }
  return value;
}

/**
 * Create new property.
 */
function createPropertiesFromTemplates() {
  const data = 
    getDataFromSheet(sheetsMeta.ga4.fullPropertyDeployment.sheetName);
  if (data.length > 0) {
    data.forEach((row, index) => {
      const create = row[row.length - 4];
      if (create) {
        const parentAccount = 'accounts/' + row[4];

        // Parse settings.
        const settings = {
          property: JSON.parse(row[6] || '[]'),
          dataRetention: JSON.parse(row[7] || '[]'),
          attribution: JSON.parse(row[8] || '[]'),
          audiences: JSON.parse(row[9] || '[]'),
          streams: JSON.parse(row[10] || '[]'),
          customDimensions: JSON.parse(row[11] || '[]'),
          customMetrics: JSON.parse(row[12] || '[]'),
          conversionEvents: JSON.parse(row[13] || '[]'),
          googleAdsLinks: JSON.parse(row[14] || '[]'),
          displayVideo360AdvertiserLinks: JSON.parse(row[15] || '[]'),
          searchAds360Links: JSON.parse(row[16] || '[]'),
          firebaseLinks: JSON.parse(row[17] || '[]')
        };

        let newProperty = null;
        let responses = [];
        for (setting in settings) {
          if (setting == 'property') {
            // Create new property.
            settings.property.displayName = row[5];
            newProperty = createGA4Entity(
              'properties', parentAccount, settings.property);
            responses.push(newProperty);
            console.log(newProperty.name);
          } else if (setting == 'dataRetention') {
            // Set data retention settings.
            const drs = AnalyticsAdmin.Properties.getDataRetentionSettings(
              newProperty.name + '/dataRetentionSettings');
            const response = AnalyticsAdmin.Properties
            .updateDataRetentionSettings(
              settings.dataRetention, drs.name, {updateMask: '*'});
            responses.push(response);
            Utilities.sleep(100);
          } else if (setting == 'attribution') {
            // Set attribution settings.
            const as = AnalyticsAdmin.Properties.getAttributionSettings(
              newProperty.name + '/attributionSettings');
            const response = AnalyticsAdmin.Properties
              .updateAttributionSettings(settings.attribution, as.name, 
              {
                updateMask: 'acquisitionConversionEventLookbackWindow,otherConversionEventLookbackWindow,reportingAttributionModel'
              });
            responses.push(response);
            Utilities.sleep(100);
          } else {
            // Create settings.
            const values = settings[setting];
            if (values.length > 0) {
              values.forEach(value => {
                const response = createGA4Entity(
                  setting, newProperty.name, value);
                responses.push(response);
              });
            }
          }
        }
        const sheet = SpreadsheetApp.getActive().getSheetByName(
          sheetsMeta.ga4.fullPropertyDeployment.sheetName
        );
        // Set new property URL in the spreadsheet.
        sheet.getRange(
            index + 2, 
            sheetsMeta.ga4.fullPropertyDeployment.read.numColumns - 4, 1, 1)
          .setFormula(
            '=HYPERLINK("https://analytics.google.com/analytics/web/#/p' + 
            newProperty.name.split('/')[1] + '", "New Property")');
        // Write the actions taken.
        writeActionTakenToSheet(
          sheetsMeta.ga4.fullPropertyDeployment.sheetName, index, 
          responseCheck(responses, 'create'));
      }
    });
  }
}

/**
 * Writes all of property deployment templates to a spreadsheet.
 */
function writePropertyTemplatesToSheet() {
  const properties = getSelectedGa4Properties();
  const data = listAllFeatureSettings(properties);
  clearSheetContent(sheetsMeta.ga4.fullPropertyDeployment);
  if (data.length > 0) {
    writeToSheet(data, sheetsMeta.ga4.fullPropertyDeployment.sheetName);
    resizeEasyPropertyCreationSheetRowHeights();
  }
}

/**
 * Resizes the row heights for the easy property creation sheet.
 */
function resizeEasyPropertyCreationSheetRowHeights() {
  resizeRowHeights(sheetsMeta.ga4.fullPropertyDeployment.sheetName, 50);
}