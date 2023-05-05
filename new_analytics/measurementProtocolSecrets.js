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
 * Retrieves the measurement protocol secrets for a given set of data streams.
 * @param {!Array<!Array>} streams A two dimensional array of
 * account and property names and ids.
 * @return {!Array<!Array>} A two dimensional array where each
 * array contains metadata about the channel groups for the given
 * set of properties.
 */
function listGA4MeasurementProtocolSecrets(streams) {
  let sheetValuesArray = [];
  streams.forEach(stream => {
    const streamName = `properties/${stream[3]}/dataStreams/${stream[5]}`;
    const secrets = listGA4Entities(
      'measurementProtocolSecrets', streamName).measurementProtocolSecrets;
    if (secrets) {
      secrets.forEach(secret => {
        sheetValuesArray.push([
          stream[0],
          stream[1],
          stream[2],
          stream[3],
          stream[4],
          stream[5],
          secret.displayName,
          secret.name,
          secret.secretValue
        ]);
      });
    }
  });
  return sheetValuesArray;
}

/**
 * Writes GA4 measurement protocol secrets to a sheet.
 */
function writeGA4MeasurementProtocolSecretsToSheet() {
  const selectedStreams = getSelectedGa4DataStreams();
  const mps = listGA4MeasurementProtocolSecrets(selectedStreams);
  clearSheetContent(sheetsMeta.ga4.measurementProtocolSecrets);
  writeToSheet(mps, sheetsMeta.ga4.measurementProtocolSecrets.sheetName);
}