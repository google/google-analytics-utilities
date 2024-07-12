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
 * The user access report settings based on the values from the "User Access
 * Report Settings" sheet.
 * @interface
 */
class UserAccessReportRequestSettings {
  /**
   * @param {!Array<string|Date|number>} sheetValues An array of various user
   * access report request settings.
   */
  constructor(sheetValues) {
    /** @type {!Array<!Object<string>>} The dimensions requested and displayed 
     * in the response.
     */
    this.dimensions = sheetValues[4].split(',').map(
      (value) => ({dimensionName: value.trim()}));
    /** @type {!Array<!Object<string>>} The metrics requested and displayed in 
     * the response.
     */
    this.metrics = sheetValues[5].split(',').map(
      (value) => ({metricName: value.trim()}));
    /** @type {string} The row count of the start row. */
    this.offset = sheetValues[6].toString().trim() || '0';
    /** @type {string} The number of rows to return. */
    this.limit = sheetValues[7].toString().trim() || '10000';
    /** @type {string} This request's time zone if specified. */
    this.timeZone = sheetValues[8].trim();
    /** @type {boolean} Determines whether to include users who have never made 
     * an API call in the response. 
     */
    this.includeAllUsers = sheetValues[9];
    /**
     * @type {boolean} Decides whether to return the users within user groups.
     * This field works only when includeAllUsers is set to true.
     */
    this.expandGroups = sheetValues[10];
    /** @type {boolean} Decides if the request is made at the account level. */
    this.accountLevelReport = sheetValues[11];
    /** @type {boolean} Toggles whether to return the current state of this
     * Analytics Property's quota.
     */
    this.returnEntityQuota = false;
    /** @type {!Array<!DateRange>} Date ranges of access records to read. */
    this.dateRanges = [new DateRange(
      sheetValues[0], sheetValues[1], this.timeZone)];
    if (sheetValues[2].toString().length > 0) {
      this.dateRanges.push(
        new DateRange(sheetValues[2], sheetValues[3], this.timeZone));
    }
  }
}

/**
 * An entity that contains the account, property, and stream names and IDs
 * based on selections from the account summaries or data stream selection
 * sheets.
 * @interface
 */
class Entity {
  /**
   * @param {!Array<string>} sheetValues An array of account, property, and 
   * stream data from the sheet row.
   */
  constructor(sheetValues) {
    /** @type {stirng} The account name for an entity. */
    this.accountName = sheetValues[0];
    /** @type {stirng} The account ID for an entity. */
    this.accountId = sheetValues[1];
    /** @type {stirng} The property name for an entity. */
    this.propertyName = sheetValues[2] || '';
    /** @type {stirng} The property ID for an entity. */
    this.propertyId = sheetValues[3] || '';
    /** @type {stirng} The stream name for an entity. */
    this.streamName = sheetValues[4] || '';
    /** @type {stirng} The stream ID for an entity. */
    this.streamId = sheetValues[5] || '';
  }
}

/**
 * Start and end dates in YYYY-MM-DD format.
 * @interface
 */
class DateRange {
  /**
   * @param {!Date} startDate The date range start date.
   * @param {!Date} endDate The date range end date.
   * @param {string} timeZone The date range time zone.
   */
  constructor(startDate, endDate, timeZone) {
    /** @type {string} The start date in YYYY-MM-DD format. */
    this.startDate = Utilities.formatDate(startDate, timeZone, 'yyyy-MM-dd');
    /** @type {string} The end date in YYYY-MM-DD format. */
    this.endDate = Utilities.formatDate(endDate, timeZone, 'yyyy-MM-dd');
  }
}
