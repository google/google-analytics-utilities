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
 * Lists the users for all properties and their associated accounts.
 * @param {!Array<!Array>} A double array of selected properties.
 * 
 */
function listGA4AccessBindings(properties) {
  const accounts = [];
  const formattedAccessBindings = [];
  properties.forEach(property => {
    const accountName = 'accounts/' + property[1];
    const propertyName = 'properties/' + property[3];
    if (accounts.indexOf(accountName) == -1) {
      accounts.push(accountName);
      const accountAccessBindings = listGA4Entities(
        'accountAccessBindings', accountName).accessBindings;
      if (accountAccessBindings) {
        accountAccessBindings.forEach(accessBinding => {
          formattedAccessBindings.push([
            property[0],
            property[1],
            '', '',
            accessBinding.user,
            accessBinding.name,
            'account',
            getPrimaryRoles(accessBinding.roles),
            getSecondaryRoles(accessBinding.roles)
          ]);
        });
      }
    }

    if (property[3] != '') {
      const propertyAccessBindings = listGA4Entities(
        'propertyAccessBindings', propertyName).accessBindings;
      if (propertyAccessBindings) {
        propertyAccessBindings.forEach(accessBinding => {
          formattedAccessBindings.push([
            property[0],
            property[1],
            property[2],
            property[3],
            accessBinding.user,
            accessBinding.name,
            'property',
            getPrimaryRoles(accessBinding.roles),
            getSecondaryRoles(accessBinding.roles)
          ]);
        });
      }
    }
  });
  return formattedAccessBindings;
}

/**
 * 
 */
function getPrimaryRoles(roles) {
  const templateRoles = [
    'predefinedRoles/viewer',
    'predefinedRoles/analyst',
    'predefinedRoles/editor',
    'predefinedRoles/admin'
  ];
  if (roles.length > 0) {
    for (let i = 0; i < roles.length; i++) {
      if (templateRoles.indexOf(roles[i]) > 0) {
        return roles[i];
      }
    }
  }
}

/**
 * 
 */
function getSecondaryRoles(roles) {
  const templateRoles = [
    'predefinedRoles/no-cost-data',
    'predefinedRoles/no-revenue-data'
  ];
  let finalRoles = [];
  if (roles.length > 1) {
    for (let i = 0; i < roles.length; i++) {
      if (templateRoles.indexOf(roles[i]) > -1) {
        finalRoles.push(roles[i]);
      }
    }
  }
  return finalRoles.join(', ');
}

/**
 * Writes GA4 user link settings to a sheet.
 */
function writeGA4AccessBindingsToSheet() {
  const selectedProperties = getSelectedGa4Properties();
  const accessBindings = listGA4AccessBindings(selectedProperties);
  clearSheetContent(sheetsMeta.ga4.accessBindings);
  writeToSheet(accessBindings, sheetsMeta.ga4.accessBindings.sheetName);
}
