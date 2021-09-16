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
 * 
 */
function listSelectedGA4Streams(properties) {
  const dataStreams = [];
  properties.forEach(property => {
    const propertyName = 'properties/' + property[3];
    const webStreams = listGA4Entities(
      propertyName + ga4RequestSuffix.webDataStreams
    ).webDataStreams;
    if (webStreams != undefined) {
      webStreams.forEach(stream => {
        const tempArray = [];
        tempArray.push(
          property[0],
          property[1],
          property[2],
          property[3],
          'Web',
          stream.displayName,
          stream.name.split('/')[1],
          stream.measurementId,
          '', '',
          stream.firebaseAppId,
          stream.createTime,
          stream.updateTime,
          stream.defaultUri)
        const enhancedMeasurementSettings = getEnhancedMeasurementSettings(stream.name);
        if (enhancedMeasurementSettings != undefined) {
          tempArray.push(
            enhancedMeasurementSettings.streamEnabled,
            enhancedMeasurementSettings.pageViewsEnabled,
            enhancedMeasurementSettings.scrollsEnabled,
            enhancedMeasurementSettings.outboundClicksEnabled,
            enhancedMeasurementSettings.siteSearchEnabled,
            enhancedMeasurementSettings.videoEngagementEnabled,
            enhancedMeasurementSettings.fileDownloadsEnabled,
            enhancedMeasurementSettings.pageLoadsEnabled,
            enhancedMeasurementSettings.pageChangesEnabled,
            enhancedMeasurementSettings.searchQueryParameter,
            enhancedMeasurementSettings.uriQueryParameter
          );
        } else {
          tempArray.push('', '', '', '', '', '', '', '', '', '', '');
        }
        dataStreams.push(tempArray);
      });
    }
    const androidStreams = listGA4Entities(
      propertyName + ga4RequestSuffix.androidAppDataStreams
    ).androidStreams;
    if (androidStreams != undefined) {
      androidStreams.forEach(stream => {
        dataStreams.push([
          property[0],
          property[1],
          property[2],
          property[3],
          'Android',
          stream.displayName,
          stream.name.split('/')[1],
          '',
          stream.packageName,
          '',
          stream.firebaseAppId,
          stream.createTime,
          stream.updateTime,
          stream.defaultUri
        ]);
      });
    }
    const iosStreams = listGA4Entities(
      propertyName + ga4RequestSuffix.iosAppDataStreams
    ).iosStreams;
    if (iosStreams != undefined) {
      iosStreams.forEach(stream => {
        dataStreams.push([
          property[0],
          property[1],
          property[2],
          property[3],
          'iOS',
          stream.displayName,
          stream.name.split('/')[1],
          '', '',
          stream.bundleId,
          stream.firebaseAppId,
          stream.createTime,
          stream.updateTime,
          stream.defaultUri
        ]);
      });
    }
  });
  return dataStreams;
}

/**
 * Writes data streams to a sheet.
 */
function writeGA4StreamsToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const streams = listSelectedGA4Streams(selectedProperties);
  writeToSheet(streams, sheetNames.ga4.streams);
}