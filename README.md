## Google Analytics Utilities

This is not an officially supported Google product.

This repository contains an app script that can be used in combination with a Google Spreadsheet to save various information in bulk or individually about Universal Google Analytics accounts, properties, or views to a spreadsheet. Additional information about Google Analytics 4 properties can be saved. 

The script makes use of the following APIs:



*   Google Analytics Management API 
*   Google Analytics Reporting API version 4
*   Google Analytics Admin API

The script currently performs the following functions:



*   Universal Analytics
    *   List account summaries
    *   List view details
    *   List up to 1000 unique event category, action, and label combinations per view
    *   Report on specific metrics for selected views
    *   Custom dimensions
        *   List 
        *   Create/Update 
    *   Custom metrics
        *   List
        *   Create/Update
    *   List view level filter settings
    *   Audiences
        *   List settings
        *   Delete
    *   Goal settings
        *   List
        *   Create
*   Google Analytics 4
    *   List account summaries
    *   List data streams
    *   GA4 custom dimensions
        *   List
        *   Create
        *   Archive
    *   GA4 custom metrics
        *   List
        *   Create
        *   Archive
    *   Conversion events
        *   List
        *   Create
        *   Delete
    *   Firebase links
        *   List
        *   Create
        *   Delete
    *   GA4 Google Ads links
        *   List
        *   Create
        *   Delete

These tasks can be completed by [joining the Google Group](https://groups.google.com/g/google-analytics-utilities-users), [copying the template spreadsheet](https://docs.google.com/spreadsheets/d/1kJqwYNed8RTuAgjy0aRUooD__MIPqzUeiDF5LZ7v1aI/), and clicking on various options under the Google Analytics Utilities menu. To enable Google Analytics 4 scripts, a user must [follow the steps](https://github.com/google/google-analytics-utilities#enable-google-analytics-4-utilities) outlined below.

In order to access information about a given Analytics account, a user must have at least read and analyze permissions for the accounts, properties, and views they are interested in. If a user wants to create or update settings, they must have edit permissions.

All API requests are subject to the normal limitations [documented here](https://developers.google.com/analytics/devguides/config/mgmt/v3/limits-quotas).


## How to Access the Spreadsheet

It is strongly recommended that you use the template spreadsheet to use the Google Analytics Utilities script. Follow these steps to make a copy of the template spreadsheet and start using the script:



1. Join [this group](https://groups.google.com/g/google-analytics-utilities-users) to gain access to the spreadsheet.
2. Create a copy of [this spreadsheet](https://docs.google.com/spreadsheets/d/1kJqwYNed8RTuAgjy0aRUooD__MIPqzUeiDF5LZ7v1aI/).

The spreadsheet is now ready to use the Google Analytics Utilities sheet. The first time you run a function from the menu, you will need to authorize the permissions for the script and then run the function a second time.

If you are not copying the script, then the Google Analytics API and Analytics Reporting API services need to be enabled.


## Enable Google Analytics 4 Utilities

In order to use the Google Analytics 4 utilities, you must first connect your spreadsheet to a Google Cloud project with the Analytics Admin API enabled. To do so, follow these steps:


### Create a Cloud Project



1. Navigate to [console.cloud.google.com/home](console.cloud.google.com/home) and either create a new project or select and existing one
2.  Navigate to [console.cloud.google.com/apis/library](http://console.cloud.google.com/apis/library) for your project and search for “Google Analytics Admin API”
3. Enable the Google Analytics Admin API
4. Navigate to [console.cloud.google.com/iam-admin/settings](console.cloud.google.com/iam-admin/settings) for your project and copy the project Number


### Connect App Script to Cloud Project



1. Open the script connected to your spreadsheet by going to Extensions > App Script
2. Click on “Project Settings” in the left-hand navigation to modify your project settings
3. Under Google Cloud Platform (GCP) Project, click “Change project” and paste your project ID from earlier
4. Click “Set Project”

Your script can now start using the Google Analytics Admin API to request information about Google Analytics 4 accounts.


## Show and Hide Sheets

To make managing the sheets easier, you can show or hide sheets related to Universal Analytics and Google Analytics 4.


## Universal Analytics


### Account Summaries



1. Navigate to the “UA Account Summaries” sheet.
2. Click on Google Analytics Utilities > Universal Analytics > List Account Summaries. 
3. The script will identify all of the Google Analytics accounts your email has access to and list a flattened table of accounts, properties, and views in the “UA Account Summaries” sheet. 
    *   This sheet can then be used to select specific accounts, properties, or views for other functions, like listing custom dimensions or view settings.


### View Details



1. List account summaries. 
2. Select the specific views from which you want to retrieve view details.
3. Navigate to the “View Details List” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > List View Details. 
5. The script will save almost all of the information indicated [here](https://developers.google.com/analytics/devguides/config/mgmt/v3/mgmtReference/management/profiles) for each selected view in the “View Details List” sheet.


### Events



1. List account summaries. 
2. Select the specific views from which you want to retrieve event data. 
3. Navigate to the “Settings” sheet and enter the start date and end date for the time frame you are interested in.
4. Navigate to the “Events” sheet.
5. Click on Google Analytics Utilities > Universal Analytics > List Events. 
6. The script will save up to 1000 unique combinations of the event category, action, and label values in the view to the “Events” sheet. If no events existed in the view for the selected view, a row will be added for the view, but the event information will be set to “No Events”.


### Retrieve Metrics from Selected Views



1. List account summaries. 
2. Select the specific views from which you want to retrieve metric data.
3. Navigate to the “Settings” sheet and enter the start date and end date for the time frame you are interested in.
4. Navigate to the “UA Metrics Request” sheet.
5. In row 1, specify the metric data you would like to retrieve from a given view by selecting a metric from the dropdown. You can also create [expressions](https://developers.google.com/analytics/devguides/reporting/core/v4/basics#expressions) like ga:sessions/ga:users.
6. Click on Google Analytics Utilities > Universal Analytics > List Metrics. 
7. This script will retrieve the specific metric data for each view and save the data from each view on a separate line.


### Custom Dimensions


#### List Custom Dimensions



1. List account summaries. 
2. Since the account summaries sheet lists each sheet as a different row but custom dimensions exist at the property level, select one view per property for which you are interested and the script will identify the correct property.
3. Navigate to the “UA Custom Dimensions” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > Custom Dimensions > List Custom Dimensions.
5. The script will save all of the custom dimensions for the selected properties to the “UA Custom Dimensions” sheet.


#### Create/Update Custom Dimensions



1. Navigate to the UA Custom Dimensions - Modify sheet
2. Enter the template property information that has the custom dimensions you want to copy to other properties
3. Click  on Google Analytics Utilities > Universal Analytics > Custom Dimensions > Modify Custom Dimensions > List Template Dimensions
4. Check the boxes for the custom dimensions you want to copy to other properties
5.  Set “Overwrite Existing CD Settings” to True if the script should overwrite any existing custom dimension settings at the same index for the selected dimensions.
6. Set the placeholder custom dimension name, scope, and if it should be active. A placeholder will be created if there is a gap between the custom dimensions that exist in a property and the custom dimensions that are selected to be created. (E.g. If there are 5 dimensions in the destination property but custom dimensions 10 - 15 are selected to be copied from the template, then custom dimensions 6-9 will be created as placeholders.)
    1. Note: If no placeholder information is provided, then it will default to these values: 
        1. Name: Placeholder
        2. Scope: Hit
        3. Active: False
7. Click  on Google Analytics Utilities > Universal Analytics > Custom Dimensions > Modify Custom Dimensions > List Destination Properties
8. Select the destination properties where the custom dimensions will be copied to.
9. Click  on Google Analytics Utilities > Universal Analytics > Custom Dimensions > Modify Custom Dimensions > Modify Custom Dimensions
10. The script will now go through the process of updating and/or creating custom dimensions. The results will be recorded in the UA Custom Dimensions - Modify - Results sheet.


### Custom Metrics


#### List Custom Metrics



1. List account summaries. 
2. Since the account summaries sheet lists each sheet as a different row but custom metrics exist at the property level, select one view per property for which you are interested and the script will identify the correct property.
3. Navigate to the “UA Custom Metrics” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > Custom Metrics > List Custom Metrics.
5. The script will save all of the custom metrics for the selected properties to the “UA Custom Metrics” sheet.


#### Create/Update Custom Metrics



1. Navigate to the UA Custom Metrics - Modify sheet
2. Enter the template property information that has the custom metrics you want to copy to other properties
3. Click  on Google Analytics Utilities > Universal Analytics > Custom Metrics > Modify Custom Metrics > List Template Metrics
4. Check the boxes for the custom metrics you want to copy to other properties
5.  Set “Overwrite Existing CD Settings” to True if the script should overwrite any existing custom metric settings at the same index for the selected metrics.
6. Set the placeholder custom metric name, scope, if it should be active, min value, max value, and type . A placeholder will be created if there is a gap between the custom metrics that exist in a property and the custom metrics that are selected to be created. (E.g. If there are 5 metrics in the destination property but custom metrics 10 - 15 are selected to be copied from the template, then custom metrics 6-9 will be created as placeholders.)
    1. Note: If no placeholder information is provided, then it will default to these values: 
        1. Name: Placeholder
        2. Scope: Hit
        3. Active: False
        4. Min Value: blank
        5. Max Value: blank
        6. Type: Integer
7. Click  on Google Analytics Utilities > Universal Analytics > Custom Metrics > Modify Custom Metrics > List Destination Properties
8. Select the destination properties where the custom metrics will be copied to.
9. Click  on Google Analytics Utilities > Universal Analytics > Custom Metrics > Modify Custom Metrics > Modify Custom Metrics
10. The script will now go through the process of updating and/or creating custom metrics. The results will be recorded in the UA Custom Metrics - Modify - Results sheet.


### Filters



1. List account summaries. 
2. Select the specific views from which you want to retrieve filters settings.
3. Navigate to the “Filters” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > List Filters.
5. The script will save all of the filters and their settings that are applied to the selected views to the “Filters” sheet. 
    *   Since the same filter may be applied to multiple views, that filter and its settings may appear in the sheet multiple times. A filter will not show up in the sheet if it is not applied to one of the selected views.


### Google Analytics Remarketing Audiences


#### List Settings



1. List account summaries. 
2. Since the account summaries sheet lists each sheet as a different row but audiences exist at the property level, select one view per property for which you are interested and the script will identify the correct property.
3. Navigate to the “UA Audiences” sheet.
4. Click on GA Utilities > Universal Analytics > Remarketing Audiences > List Settings.
5. The script will save all of the audiences and their respective settings that exist for the selected properties to the “UA Audiences” sheet. Audience size cannot be retrieved via the Google Analytics Management API and will not be saved to the sheet.


#### Delete



1. List account summaries. 
2. Since the account summaries sheet lists each sheet as a different row but audiences exist at the property level, select one view per property for which you are interested and the script will identify the correct property.
3. Navigate to the “UA Audiences” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > Remarketing Audiences > List Settings.
5. Check the “Delete” box for each audience you want to delete.
6. Click on Google Analytics Utilities > Universal Analytics > Remarketing Audiences > Delete or Create.
7. The script will attempt to delete the selected audiences.


### List Goals Settings



1. List account summaries.
2. Select the specific views from which you want to retrieve the goal settings.
3. Navigate to the “Goal Settings” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > Goals > List Goals. 
5. The script will save all of the goal settings for the selected views to the “Goal Settings” sheet. The number of goal completions will not be saved to the sheet.


### Create Goals



1. Enter the goals settings for the goals that are to be created in the “Goal Settings” sheet.
    1. Note: This process does not use or reference information in the “Account Summaries” sheet.
2. Select which goals that are going to be created by checking the box under column W.
3. Click on Google Analytics Utilities > Universal Analytics > Goals > Create Goals.
4. The script will create the goals in the specified views based on the information entered in the “Goal Settings” sheet.


## Google Analytics 4


### List Account Summaries



1. Navigate to “GA4 Account Summaries”
2. Click on Google Analytics Utilities > Google Analytics 4 > List Account Summaries. 
3. The script will identify all of the Google Analytics 4 properties your email has access to and list a flattened table of accounts and properties in the “GA4 Account Summaries” sheet. 
    *   This sheet can then be used to select specific accounts and properties for other functions.


### List Data Streams



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve data streams.
3. Navigate to the “Data Streams” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > List Properties and Streams.
5. The data streams for the selected properties will be listed in the “Data Streams” sheet


### Custom Dimensions


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve custom dimensions.
3. Navigate to the “GA4 Custom Dimensions” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Custom Dimensions > List.
5. The custom dimensions for the selected properties will be listed in the “GA4 Custom Dimensions” sheet.


#### Create



1. Navigate to the “GA4 Custom Dimensions” sheet.
2. Enter the account ID, property ID, Custom Dimension Name (the name displayed in the UI), parameter name (the name collected in the code/tags), scope, description, and whether or not ads personalization is disallowed. Check the box under the “Create” column to tell the script to create a custom dimension based on the provided settings. Repeat this step in a new row for each custom dimension you want to create.
3. Click on Google Analytics Utilities > Google Analytics 4 > Custom Dimensions > Delete or Create.
4. The script will attempt to create a new custom dimension based on the information in each row.


#### Archive



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve custom dimensions.
3. Navigate to the “GA4 Custom Dimensions” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Custom Dimensions > List.
5. Check the “Archive” box for each custom dimension you want to archive.
6. Click on Google Analytics Utilities > Google Analytics 4 > Custom Dimensions > Delete or Create.
7. The script will attempt to archive the selected custom dimensions.


### Custom Metrics


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve custom metrics.
3. Navigate to the “GA4 Custom Metrics” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Custom Metrics > List.
5. The custom metrics for the selected properties will be listed in the “GA4 Custom Metrics” sheet.


#### Create



1. Navigate to the “GA4 Custom Metrics” sheet.
2. Enter the account ID, property ID, Custom Metric Name (the name displayed in the UI), parameter name (the name collected in the code/tags), scope,  measurement unit, and description. Check the box under the “Create” column to tell the script to create a custom metric based on the provided settings. Repeat this step in a new row for each custom metric you want to create.
3. Click on Google Analytics Utilities > Google Analytics 4 > Custom Metrics > Archive or Create.
4. The script will attempt to create a new custom metric based on the information in each row.


#### Archive



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve custom metrics.
3. Navigate to the “GA4 Custom Metrics” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Custom Metrics > List.
5. Check the “Archive” box for each custom metric you want to archive.
6. Click on Google Analytics Utilities > Google Analytics 4 > Custom Metrics > Archive or Create.
7. The script will attempt to archive the selected custom metric.


### Conversion Events


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve conversion events.
3. Navigate to the “GA4 Conversion Events” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Conversion Events > List.
5. The conversion events for the selected properties will be listed in the “GA4 Conversion Events” sheet.


#### Create



1. Navigate to the “GA4 Conversion Events” sheet.
2. Enter the account ID, property ID, and event name. Check the box under the “Create” column to tell the script to create a conversion event based on the provided settings. Repeat this step in a new row for each conversion event you want to create.
3. Click on Google Analytics Utilities > Google Analytics 4 > Conversion Events > Delete or Create.
4. The script will attempt to create a new conversion event based on the information in each row.


#### Delete



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve conversion events.
3. Navigate to the “GA4 Conversion Events” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Conversion Events > List.
5. Check the “Delete” box for each conversion event you want to delete.
6. Click on Google Analytics Utilities > Google Analytics 4 > Conversion Events > Delete or Create.
7. The script will attempt to delete the selected conversion events.


### Firebase Links


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve Firebase links.
3. Navigate to the “GA4 Firebase Links” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Firebase Links > List.
5. The Firebase links for the selected properties will be listed in the “GA4 Firebase Links” sheet.


#### Create



1. Navigate to the “GA4 Firebase Links” sheet.
2. Enter the account ID, property ID, and Firebase project ID or name. Check the box under the “Create” column to tell the script to create a Firebase link based on the provided settings. Repeat this step in a new row for each Firebase link you want to create.
3. Click on Google Analytics Utilities > Google Analytics 4 > Firebase Links > Delete or Create.
4. The script will attempt to create a new Firebase link based on the information in each row.


#### Delete



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve Firebase links.
3. Navigate to the “GA4 Firebase Links” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Firebase Links > List.
5. Check the “Delete” box for each Firebase link you want to delete.
6. Click on Google Analytics Utilities > Google Analytics 4 > Firebase Links > Delete or Create.
7. The script will attempt to delete the selected Firebase links.


### Google Ads Links


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve Google Ads links.
3. Navigate to the “GA4 Google Ads Links” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Google Ads Links > List.
5. The Google Ads links for the selected properties will be listed in the “GA4 Google Ads Links” sheet.


#### Create



1. Navigate to the “GA4 Google Ads Links” sheet.
2. Enter the account ID, property ID, Google Ads client ID, and whether or not ads data validation should be enabled. Check the box under the “Create” column to tell the script to create a Google Ads link based on the provided settings. Repeat this step in a new row for each Google Ads link you want to create.
3. Click on Google Analytics Utilities > Google Analytics 4 > Google Ads Links > Delete or Create.
4. The script will attempt to create a new Google Ads link based on the information in each row.


#### Delete



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve Google Ads links.
3. Navigate to the “GA4 Google Ads Links” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Google Ads Links > List.
5. Check the “Delete” box for each Google Ads link you want to delete.
6. Click on Google Analytics Utilities > Google Analytics 4 > Firebase Links > Delete or Create.
7. The script will attempt to delete the selected Google Ads links.