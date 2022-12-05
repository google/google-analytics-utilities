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
 * 
 */
function listUAUsers(selectedAccounts) {
  const userList = [];
  const alreadyAccessedAccounts = [];
  for (let i = 0; i < selectedAccounts.length; i++) {
    const accountName = selectedAccounts[i][0];
    const accountId = selectedAccounts[i][1].toString();
    if (alreadyAccessedAccounts.indexOf(accountId) == -1) {
      alreadyAccessedAccounts.push(accountId);
      Analytics.Management.AccountUserLinks.list(accountId).items.forEach(function(user) {
        if (user.permissions.local.length > 0) { // Determine if the user has local access to the entity
          userList.push([
            user.userRef.email,
            user.entity.accountRef.name,
            user.entity.accountRef.id, 
            '',
            '',
            '',
            '',
            user.id,
            user.permissions.local.toString(),
            'Account'
          ]);
        }
      });
      Analytics.Management.WebpropertyUserLinks.list(accountId, '~all').items.forEach(function(user) {
        if (user.permissions.local.length > 0) {
          userList.push([
            user.userRef.email,
            accountName,
            accountId, 
            user.entity.webPropertyRef.name,
            user.entity.webPropertyRef.id, 
            '',
            '',
            user.id,
            user.permissions.local.toString(),
            'Property'
          ]);
        }
      });
      const properties = Analytics.Management.Webproperties.list(accountId).items;
      if (properties.length > 0) {
        for (let propertyIndex = 0; propertyIndex < properties.length; propertyIndex++) {
          const propertyId = properties[propertyIndex].id;
          const propertyName = properties[propertyIndex].name;
          Analytics.Management.ProfileUserLinks.list(accountId, propertyId, '~all').items.forEach(function(user) {
            if (user.permissions.local.length > 0) {
              userList.push([
                user.userRef.email,
                accountName,
                accountId, 
                propertyName,
                propertyId,
                user.entity.profileRef.name,
                user.entity.profileRef.id,
                user.id,
                user.permissions.local.toString(),
                'View'
              ]);
            }
          });
        }
      }
    }
  }
  return userList;
}

/**
 * 
 */
function writeUAUsersToSheet() {
  const views = getSelectedViews();
  const users = listUAUsers(views);
  writeToSheet(users, sheetsMeta.ua.users.sheetName);
}
