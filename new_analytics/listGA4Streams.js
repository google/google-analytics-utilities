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
    const dataStreamsResponse = listGA4Entities(
      'dataStreams', propertyName).dataStreams;
    if (dataStreamsResponse != undefined && dataStreamsResponse.length > 0) {
      dataStreamsResponse.forEach(stream => {
        const tempArray = [];
        tempArray.push(
          property[0],
          property[1],
          property[2],
          property[3],
          stream.type,
          stream.displayName,
          stream.name.split('/')[1],
          '', '', '', '',
          stream.createTime,
          stream.updateTime,
          '');
        if (stream.webStreamData != undefined) {
          tempArray[7] = stream.webStreamData.measurementId || '';
          tempArray[10] = stream.webStreamData.firebaseAppId || '';
          tempArray[13] = stream.webStreamData.defaultUri || '';
        } else if (stream.androidAppStreamData != undefined) {
          tempArray[8] = stream.androidAppStreamData.packageName || '';
          tempArray[10] = stream.androidAppStreamData.firebaseAppId || '';
        } else if (stream.iosAppStreamData != undefined) {
          tempArray[9] = stream.iosAppStreamData.bundleId || '';
          tempArray[10] = stream.iosAppStreamData.firebaseAppId || '';
        }
        dataStreams.push(tempArray);
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