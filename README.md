## Google Analytics Utilities

This is not an officially supported Google product.

This repository contains an app script that can be used in combination with a Google Spreadsheet to save various information in bulk or individually about Universal Google Analytics accounts, properties, or views to a spreadsheet. Additional information about Google Analytics 4 properties can be saved. 

The script makes use of the following APIs:

| Google Analytics Version | Resource                                                             | Capabilities                  |
|--------------------------|----------------------------------------------------------------------|-------------------------------|
| GA4                      | [Account Summaries](#account-summaries-1)                            | List                          |
| GA4                      | [Properties](#properties)                                            | List, Create, Delete, Update  |
| GA4                      | [Data Streams](#data-streams)                                        | List, Create, Delete, Update  |
| GA4                      | [Custom Dimensions](#custom-dimensions-1)                            | List, Create, Archive, Update |
| GA4                      | [Custom Metrics](#custom-metrics-1)                                  | List, Create, Archive, Update |
| GA4                      | [Conversion Events](#conversion-events)                              | List, Create, Delete          |
| GA4                      | [Firebase Links](#firebase-links)                                    | List, Create, Delete          |
| GA4                      | [Google Ads Links](#google-ads-links-1)                              | List, Create, Delete, Update  |
| GA4                      | [DV360 Links](#dv360-links)                                          | List, Create, Delete, Update  |
| GA4                      | [Audiences Settings](#ga4-audiences)                                 | List, Create, Delete, Update  |
| GA4                      | [SA360 Links](#sa360-links)                                          | List, Create, Delete, Update  |
| GA4                      | [BigQuery Links](#bigquery-links)                                    | List                          |
| GA4                      | [User Access Bindings](#ga4-users)                                   | List, Create, Delete, Update  |
| GA4                      | [Settings Report](#settings-report)                                  | Create                        |
| GA4                      | [Expanded Data Sets](#expanded-data-sets)                            | List, Create, Delete, Update  |
| GA4                      | [Easy Property Creation](#easy-property-creation)                    | Create                        |
| Universal Analytics      | [Account Summaries](#account-summaries)                              | List                          |
| Universal Analytics      | [View Details](#view-details)                                        | List                          |
| Universal Analytics      | [Events](#events)                                                    | List                          |
| Universal Analytics      | [Retrieve Metrics from Views](#retrieve-metrics-from-views)          |                               |
| Universal Analytics      | [Custom Dimensions](#custom-dimensions)                              | List, Create, Update          |
| Universal Analytics      | [Custom Metrics](#custom-metrics)                                    | List, Create, Update          |
| Universal Analytics      | [Filters](#filters)                                                  | List                          |
| Universal Analytics      | [Audience Settings](#audiences)                                      | List, Delete                  |
| Universal Analytics      | [Goals](#goals)                                                      | List, Create                  |
| Universal Analytics      | [Google Ads Links](#google-ads-links)                                | List                          |
| Universal Analytics      | [GA4 Auto Configuration Opt Out](#ua-ga4-auto-configuration-opt-out) | List, Set opt out status      |
| Universal Analytics      | [Connected Site Tags](#connected-site-tags)                          | List, Create, Delete          |


* Google Analytics Management API 
* Google Analytics Reporting API version 4
* Google Analytics Admin API
* Google Analytics Data API
* Google Drive API

If you find this tool useful, please consider leaving feedback by filling out this quick, anonymous [survey](https://docs.google.com/forms/d/e/1FAIpQLScHrZbNU2RZGMtcWTVVEsxe5ZzARFvjqFQziixNPUPCsNcUUQ/viewform).

The script currently performs the following functions:


These tasks can be completed by [joining the Google Group](https://groups.google.com/g/google-analytics-utilities-users), [copying the template spreadsheet](https://docs.google.com/spreadsheets/d/1kJqwYNed8RTuAgjy0aRUooD__MIPqzUeiDF5LZ7v1aI/), and clicking on various options under the Google Analytics Utilities menu.

To access information about a given Analytics account, a user must have at least viewer permissions for the accounts, properties, and views they are interested in. If a user wants to create or update settings, they must have editor permissions.

All API requests are subject to the limitations [documented here](https://developers.google.com/analytics/devguides/config/mgmt/v3/limits-quotas).


## How to Access the Spreadsheet

It is strongly recommended that you use the template spreadsheet to use the Google Analytics Utilities script. Follow these steps to make a copy of the template spreadsheet and start using the script:



1. Join [this group](https://groups.google.com/g/google-analytics-utilities-users) to access the spreadsheet.
2. Create a copy of [this spreadsheet](https://docs.google.com/spreadsheets/d/1kJqwYNed8RTuAgjy0aRUooD__MIPqzUeiDF5LZ7v1aI/copy).

The spreadsheet is now ready to use the Google Analytics Utilities script. The first time you run a function from the menu, you will need to authorize the permissions for the script and then run the function a second time. You may see a warning that the script is unauthorized. You should be able to proceed anyway. The script does not collect any information.


## Show and Hide Sheets

To make managing the sheets easier, you can show or hide sheets related to Universal Analytics and Google Analytics 4.


## Check for Updates

It is recommended to periodically run the “Check for Updates” menu item to see if a new version of the tool has been released.


## Universal Analytics


### Account Summaries



1. Navigate to the “UA Account Summaries” sheet.
2. Click on Google Analytics Utilities > Universal Analytics > List Account Summaries. 
3. The script will identify all the Google Analytics accounts your email has access to and list a flattened table of accounts, properties, and views in the “UA Account Summaries” sheet. 
    * This sheet can then be used to select specific accounts, properties, or views for other functions, like listing custom dimensions or view settings.


### View Details


#### List



1. List account summaries. 
2. Select the specific views from which you want to retrieve view details.
3. Navigate to the “View Details List” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > List View Details. 
5. The script will save most of the information indicated [here](https://developers.google.com/analytics/devguides/config/mgmt/v3/mgmtReference/management/profiles) for each selected view in the “View Details List” sheet.


### Events


#### List



1. List account summaries. 
2. Select the specific views from which you want to retrieve event data. 
3. Navigate to the “Settings” sheet and enter the start date and end date for the time frame you are interested in.
4. Navigate to the “Events” sheet.
5. Click on Google Analytics Utilities > Universal Analytics > List Events. 
6. The script will save up to 1000 unique combinations of the event category, action, and label values in the view to the “Events” sheet. If no events existed in the view for the selected view, a row will be added for the view, but the event information will be set to “No Events”.


### Retrieve Metrics from Views



1. List account summaries. 
2. Select the specific views from which you want to retrieve metric data.
3. Navigate to the “Settings” sheet and enter the start date and end date for the time frame you are interested in.
4. Navigate to the “UA Metrics Request” sheet.
5. In row 1, specify the metric data you would like to retrieve from a given view by selecting a metric from the dropdown. You can also create [expressions](https://developers.google.com/analytics/devguides/reporting/core/v4/basics#expressions) like ga:sessions/ga:users.
6. Click on Google Analytics Utilities > Universal Analytics > List Metrics. 
7. This script will retrieve the specific metric data for each view and save the data from each view on a separate line.


### Custom Dimensions


#### List



1. List account summaries. 
2. Since the account summaries sheet lists each view as a different row but custom dimensions exist at the property level, select one view per property for which you are interested and the script will identify the correct property.
3. Navigate to the “UA Custom Dimensions” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > Custom Dimensions > List Custom Dimensions.
5. The script will save all the custom dimensions for the selected properties to the “UA Custom Dimensions” sheet.


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


#### List



1. List account summaries. 
2. Since the account summaries sheet lists each view as a different row but custom metrics exist at the property level, select one view per property for which you are interested and the script will identify the correct property.
3. Navigate to the “UA Custom Metrics” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > Custom Metrics > List Custom Metrics.
5. The script will save all the custom metrics for the selected properties to the “UA Custom Metrics” sheet.


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
10. The script will now go through the process of updating and/or creating custom metrics. The results will be recorded in the UA Custom Metrics - Modify - Results sheet. \
 \
Note: TIME event types must have a minimum value of at least 0 and cannot be left blank. If the event type is TIME, then the default value will be set to 0. If the max value is set to greater than the minimum value for a given metric, then the max value will be removed from any update or create request.


### Filters


#### List



1. List account summaries. 
2. Select the specific views from which you want to retrieve filters settings.
3. Navigate to the “Filters” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > List Filters.
5. The script will save all of the filters and their settings that are applied to the selected views to the “Filters” sheet. 
    * Since the same filter may be applied to multiple views, that filter and its settings may appear in the sheet multiple times. A filter will not show up in the sheet if it is not applied to one of the selected views.


### Audiences


#### List Settings



1. List account summaries. 
2. Since the account summaries sheet lists each view as a different row but audiences exist at the property level, select one view per property for which you are interested and the script will identify the correct property.
3. Navigate to the “UA Audiences” sheet.
4. Click on GA Utilities > Universal Analytics > Remarketing Audiences > List Settings.
5. The script will save all the audiences and their respective settings that exist for the selected properties to the “UA Audiences” sheet. Audience size cannot be retrieved via the Google Analytics Management API and will not be saved to the sheet.


#### Delete



1. List account summaries. 
2. Since the account summaries sheet lists each view as a different row but audiences exist at the property level, select one view per property for which you are interested and the script will identify the correct property.
3. Navigate to the “UA Audiences” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > Remarketing Audiences > List Settings.
5. Check the “Delete” box for each audience you want to delete.
6. Click on Google Analytics Utilities > Universal Analytics > Remarketing Audiences > Modify.
7. The script will attempt to delete the selected audiences.


### Goals


#### List



1. List account summaries.
2. Select the specific views from which you want to retrieve the goal settings.
3. Navigate to the “Goal Settings” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > Goals > List Goals. 
5. The script will save all of the goal settings for the selected views to the “Goal Settings” sheet. The number of goal completions will not be saved to the sheet.


#### Create



1. Enter the goals settings for the goals that are to be created in the “Goal Settings” sheet.
    1. Note: This process does not use or reference information in the “Account Summaries” sheet.
2. Select which goals that are going to be created by checking the box under column W.
3. Click on Google Analytics Utilities > Universal Analytics > Goals > Create Goals.
4. The script will create the goals in the specified views based on the information entered in the “Goal Settings” sheet.


### Users


#### List



1. List UA account summaries.
2. When listing users, the script will automatically loop through all of the properties and views under a selected account, so you only need to select one row for any account you are interested in.
3. Navigate to the “UA Users” sheet.
4. Click on Google Analytics Utilities > Universal Analytics > Users > List Users. 
5. The script will save all of the account, property, and view user links for the selected accounts to the sheet. Only direct permissions will be listed. Batching of requests is not enabled. User information will only be listed if you have the necessary permissions.


### UA GA4 Auto Configuration Opt Out


#### List Properties



1. Navigate to the “UA Auto Config Opt Out” sheet.
2. Click on Google Analytics Utilities > Universal Analytics > Auto Config > List Properties
3. All properties you have access to should be listed in the sheet.


#### List Current Opt Out Status



1. After listing your properties, select the checkbox under the “Get or Update Opt Out Status” column for a given property to get its opt out status.
2. Click on Google Analytics Utilities > Universal Analytics > Auto Config > List Opt Out Statuses.
3. The opt out statuses for the properties you selected should be listed as either “TRUE” or “FALSE” under the “Opt Out?” column. All unselected properties should have a blank value.


#### Update Opt Out Status



1. After listing your properties, select the checkbox under the “Get or Update Opt Out Status” column for a given property to update its status.
2. Enter the new opt out statuses for the properties you selected.
3. Click on Google Analytics Utilities > Universal Analytics > Auto Config > Update Opt Out Statuses.
4. The “Action Taken” column should be updated for each property you updated with the word “Updated”. If an error occurred for a given property, the “Action Taken” column should say “Error:” and the error message. If a property was not selected, then the “Action Taken” cell for that row will be cleared.


### Google Ads Links


#### List



1. List UA account summaries.
2. Since the account summaries sheet lists each view as a different row but Google Ads Links exist at the property level, select one view per property for which you are interested and the script will identify the correct property.
3. Navigate to the “UA Google Ads Links” sheet.
4. Click Google Analytics Utilities > Universal Analytics > Google Ads Links > List.
5. The Google Ads Links will be listed for the selected properties. NOTE: The script will not list MCC links.


### Connected Site Tags


#### List



1. List UA account summaries.
2. Since the account summaries sheet lists each view as a different row but connected site tags exist at the property level, select one view per property for which you are interested and the script will identify the correct property.
3. Navigate to the “UA Connected Site Tags” sheet.
4. Click Google Analytics Utilities > Universal Analytics > Connected Site Tags > List.
5. The connected site tags will be listed in the sheet.


#### Create



1. Naviga to “UA Connected Site Tags”.
2. Enter the following information for each connected site tag you want to create:
    1. Internal UA property ID.
    2. Connected site tag name.
    3. Connected site tag ID (a.k.a. A GA4 measurement ID).
    4. Check the box for “Create”
3. Click Google Analytics Utilities > Universal Analytics > Connected Site Tags > Modify.
4. The script will attempt to create the connected site tags.


#### Delete



1. After listing your connected site tags, navigate to the “UA Connected Site Tags” sheet.
2. Select the connected site tags you want to delete.
3. Click Google Analytics Utilities > Universal Analytics > Connected Site Tags > Modify.
4. The script will attempt to delete the selected connected site tags.


## Google Analytics 4


### Color Coding

For the GA4 functions, whenever you check a box to archive/delete, create, or update, the sheet will highlight specific cells in each row that need to have values for the given setting to be modified or created. Please see additional details below:



* If a highlighted cell is empty, a row will remain white.
* When all the necessary fields have been entered to archive/delete a setting, the row will turn red.
* When all the necessary fields have been entered to create a setting, the row will turn green.
* When all the necessary fields have been entered to update a setting,  the row will turn blue.


### Action Taken Messages

If you archive, delete, create, or update a GA4 setting, then a corresponding action taken will be recorded in the same row. Errors will also be recorded in the “Action Taken” column. If you are missing a necessary value when trying to modify a setting, then that will likely be recorded in the “Action Taken” column taken. If you see “Error 404: HttpResponseException” then you are likely missing a value in the resource name column  (or the account ID column in the Property Details sheet) and should probably list your values again.


### Account Summaries


#### List



1. Navigate to “GA4 Account Summaries”
2. Click on Google Analytics Utilities > Google Analytics 4 > List Account Summaries. 
3. The script will identify all the Google Analytics 4 properties your email has access to and list a flattened table of accounts and properties in the “GA4 Account Summaries” sheet. 
    * This sheet can then be used to select specific accounts and properties for other functions.


### Properties


#### List



1. List GA4 account summaries.
2. Select each property for which you want to see details.
3. Navigate to the “GA4 Property Details” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Properties > List.
5. The selected property details will be listed in the “GA4 Property Details” sheet.


#### Create



1. Navigate to the “GA4 Property Details” sheet.
2. Each row represents a separate data stream. Enter the following information:
    1. Account ID
    2. Property name
    3. [Industry category](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/properties#IndustryCategory)
    4. [Time zone](https://www.iana.org/time-zones)
    5. [Currency code](https://en.wikipedia.org/wiki/ISO_4217)
    6. Data Retention Duration
        1. Note - The following values are only available for 360 properties:
            1. TWENTY_SIX_MONTHS
            2. THIRTY_EIGHT_MONTHS
            3. FIFTY_MONTHS
    7. Reset User Data on New Activity
    8. Check the box for “Create”
3. Click on Google Analytics Utilities > Google Analytics 4 > Properties > Modify.
4. The script will attempt to create the selected properties.


#### Delete



1. After listing your GA4 data streams, navigate to the “GA4 Property Details” sheet.
2. Select the data streams you want to delete.
3. Click on Google Analytics Utilities > Google Analytics 4 > Properties > Modify.
4. The script will attempt to delete the selected properties.


#### Update



1. After listing your GA4 data streams, navigate to the “GA4 Property Details” sheet.
2. Modify any of the following for a given property:
    1. Property Name
    2. Industry category
    3. Time zone
    4. Currency code
    5. Data Retention Duration
        1. Note - The following values are only available for 360 properties:
            1. TWENTY_SIX_MONTHS
            2. THIRTY_EIGHT_MONTHS
            3. FIFTY_MONTHS
    6. Reset User Data on New Activity 
3. Check the “Update” box for each property you want to update.
4. Click on Google Analytics Utilities > Google Analytics 4 > Properties > Modify.
5. The script will attempt to update the selected properties.


### Data Streams


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve data streams.
3. Navigate to the “GA4 Data Streams” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Data Streams > List.
5. The data streams for the selected properties will be listed in the “GA4 Data Streams” sheet.


#### Create



1. Navigate to the “GA4 Data Streams” sheet.
2. Each row represents a separate data stream. Enter the following information:
    1. Property ID
    2. Stream Name
    3. Stream type: 
        1. WEB_DATA_STREAM
            1. Enter the relevant Enhanced Measurement Settings
            2. Enter the default URI
        2. ANDROID_APP_DATA_STREAM
            3. Enter package ID
        3. IOS_APP_DATA_STREAM
            4. Enter bundle ID
    4. Check the box for “Create”
3. Click on Google Analytics Utilities > Google Analytics 4 > Data Streams > Modify.
4. The script will attempt to create the selected data streams.


#### Delete



1. After listing your GA4 data streams, navigate to the “GA4 Data Streams” sheet.
2. Select the data streams you want to delete.
3. Click on Google Analytics Utilities > Google Analytics 4 > Data Streams > Modify.
4. The script will attempt to delete the selected data streams.


#### Update



1. After listing your GA4 data streams, navigate to the “GA4 Data Streams” sheet.
2. Enter a new stream name for a given data stream.
    1. If the the stream type is WEB_DATA_STREAM, then you can enter the relevant Enhanced Measurement Settings
3. Check the “Update” box for each data stream you want to update.
4. Click on Google Analytics Utilities > Google Analytics 4 > Data Streams > Modify.
5. The script will attempt to update the selected data streams.


### Custom Dimensions


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve custom dimensions.
3. Navigate to the “GA4 Custom Dimensions” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Custom Dimensions > List.
5. The custom dimensions for the selected properties will be listed in the “GA4 Custom Dimensions” sheet.


#### Create



1. Navigate to the “GA4 Custom Dimensions” sheet.
2. Enter the following:
    1. Property ID
    2. Custom dimension name (the name displayed in the UI)
    3. Parameter name (the name collected in the code/tags)
    4. [Scope](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/properties.customDimensions#DimensionScope)
    5. Description
    6. Whether or not ads personalization is disallowed (true or false)
    7. Check the box for “Create”
    8. Repeat these steps in a new row for each custom dimension you want to create
3. Click on Google Analytics Utilities > Google Analytics 4 > Custom Dimensions > Modify.
4. The script will attempt to create the selected custom dimensions.


#### Archive



1. After listing your GA4 custom dimensions, navigate to the "GA4 Custom Dimensions” sheet.
2. Check the “Archive” box for each custom dimension you want to archive.
3. Click on Google Analytics Utilities > Google Analytics 4 > Custom Dimensions > Modify.
4. The script will attempt to archive the selected custom dimensions.


#### Update



1. After listing your GA4 custom dimensions, navigate to the "GA4 Custom Dimensions” sheet.
2. Enter a new custom dimension name or description for a given custom dimension.
3. Check the “Update” box for each custom dimension you want to update.
4. Click on Google Analytics Utilities > Google Analytics 4 > Custom Dimensions > Modify.
5. The script will attempt to update the selected custom dimensions.


### Custom Metrics


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve custom dimensions.
3. Navigate to the “GA4 Custom Metrics” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Custom Metrics > List.
5. The custom dimensions for the selected properties will be listed in the “GA4 Custom Metrics” sheet.


#### Create



1. Navigate to the “GA4 Custom Metrics” sheet.
2. Enter the following:
    1. Property ID
    2. Custom metric name (the name displayed in the UI)
    3. Parameter name (the name collected in the code/tags)
    4. [Scope](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/properties.customMetrics#MetricScope)
    5. [Measurement Unit](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/properties.customMetrics#MeasurementUnit)
    6. Description
    7. Check the box for “Create”
    8. Repeat these steps in a new row for each custom metric you want to create
3. Click on Google Analytics Utilities > Google Analytics 4 > Custom Metrics > Modify.
4. The script will attempt to create the selected custom metrics.


#### Archive



1. After listing your GA4 custom metrics, navigate to the "GA4 Custom Metrics” sheet.
2. Check the “Archive” box for each custom metric you want to archive.
3. Click on Google Analytics Utilities > Google Analytics 4 > Custom Metrics > Modify.
4. The script will attempt to archive the selected custom metrics.


#### Update



1. After listing your GA4 custom metrics, navigate to the "GA4 Custom Metrics” sheet.
2. Enter a new custom metric name, description, or measurement unit for a given custom metric.
3. Check the “Update” box for each custom metric you want to update.
4. Click on Google Analytics Utilities > Google Analytics 4 > Custom Metrics > Modify.
5. The script will attempt to update the selected custom metrics.


### Conversion Events


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve conversion events.
3. Navigate to the “GA4 Conversion Events” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Conversion Events > List.
5. The conversion events for the selected properties will be listed in the “GA4 Conversion Events” sheet.


#### Create



1. Navigate to the “GA4 Conversion Events” sheet.
2. Enter the following:
    1. Property ID
    2. Event name
    3. Check the box for “Create”
    4. Repeat these steps in a new row for each conversion event you want to create
3. Click on Google Analytics Utilities > Google Analytics 4 > Conversion Events > Modify.
4. The script will attempt to create a new conversion event based on the information in each row.


#### Delete



1. After listing your GA4 conversion events, navigate to the "GA4 Conversion Events” sheet.
2. Check the “Delete” box for each conversion event you want to delete.
3. Click on Google Analytics Utilities > Google Analytics 4 > Conversion Events > Modify.
4. The script will attempt to delete the selected conversion events.


### Firebase Links


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve Firebase links.
3. Navigate to the “GA4 Firebase Links” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Firebase Links > List.
5. The Firebase links for the selected properties will be listed in the “GA4 Firebase Links” sheet.


#### Create



1. Navigate to the “GA4 Firebase Links” sheet.
2. Enter the following:
    1. Property ID
    2. Firebase project ID or name
    3. Check the box for “Create”
    4. Repeat these steps in a new row for each Firebase link you want to create
3. Click on Google Analytics Utilities > Google Analytics 4 > Firebase Links > Modify.
4. The script will attempt to create a new Firebase link based on the information in each row.


#### Delete



1. After listing your GA4 firebase links, navigate to the “GA4 Firebase Links” sheet.
2. Check the “Delete” box for each Firebase link you want to delete.
3. Click on Google Analytics Utilities > Google Analytics 4 > Firebase Links > Modify.
4. The script will attempt to delete the selected Firebase links.


### Google Ads Links


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve Google Ads links.
3. Navigate to the “GA4 Google Ads Links” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Google Ads Links > List.
5. The Google Ads links for the selected properties will be listed in the “GA4 Google Ads Links” sheet.


#### Create



1. Navigate to the “GA4 Google Ads Links” sheet.
2. Enter the following:
    1. Property ID
    2. Google Ads client ID
    3. True or false for “Ads Personalization Enabled”
    4. Check the box for “Create”
    5. Repeat these steps in a new row for each Google Ads link you want to create
3. Click on Google Analytics Utilities > Google Analytics 4 > Google Ads Links > Modify.
4. The script will attempt to create a new Google Ads link based on the information in each row.


#### Delete



1. After listing your GA4 Google Ads links, navigate to the “GA4 Google Ads Links” sheet.
2. Check the “Delete” box for each Google Ads link you want to delete.
3. Click on Google Analytics Utilities > Google Analytics 4 > Google Ads Links > Modify.
4. The script will attempt to delete the selected Google Ads links.


#### Update



1. After listing your GA4 Google Ads links, navigate to the “GA4 Google Ads Links” sheet.
2. Enter true or false for “Ads Personalization Enabled”
3. Check the “Update” box for each Google Ads link you want to update.
4. Click on Google Analytics Utilities > Google Analytics 4 > Google Ads Links > Modify.
5. The script will attempt to update the selected Google Ads links.


### DV360 Links


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve DV360 links.
3. Navigate to the “GA4 DV360 Links” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > DV360 Links > List.
5. The DV360 links for the selected properties will be listed in the “GA4 DV360 Links” sheet.


#### Create



1. Navigate to the “GA4 DV360 Links” sheet.
2. Enter the following:
    1. Property ID
    2. Advertiser ID
    3. True or false for “Ads Personalization Enabled”
    4. True or false for “Campaign Data Sharing Enabled”
    5. True or false for “Cost Data Sharing Enabled”
    6. Check the box for “Create”
    7. Repeat these steps in a new row for each DV360 link you want to create
3. Click on Google Analytics Utilities > Google Analytics 4 > DV360 Links > Modify.
4. The script will attempt to create a new DV360 link based on the information in each row.


#### Delete



1. After listing your GA4 DV360 links, navigate to the “GA4 DV360 Links” sheet.
2. Check the “Delete” box for each DV360 link you want to delete.
3. Click on Google Analytics Utilities > Google Analytics 4 > DV360 Links > Modify.
4. The script will attempt to delete the selected DV360 links.


#### Update



1. After listing your GA4 DV360 links, navigate to the “GA4 DV360 Links” sheet.
2. Enter true or false for “Ads Personalization Enabled”
3. Check the “Update” box for each DV360 link you want to update.
4. Click on Google Analytics Utilities > Google Analytics 4 > DV360 Links > Modify.
5. The script will attempt to update the selected DV360 links.


### GA4 Audiences


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve audiences.
3. Navigate to the “GA4 Audiences” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Audiences > List.
5. The audiences for the selected properties will be listed in the “GA4 Audiences” sheet.


#### Create



1. Navigate to the “GA4 Audiences” sheet.
2. Enter the following:
    1. Property ID
    2. Audience Name
    3. Audience Description
    4. Membership Duration
    5. Filter Clauses
    6. (Optional) Event Trigger Name
    7. (Optional) Event Trigger Log Condition
    8. (Only set with exclusion filter conditions) Exclusion Duration Mode
    9. Repeat these steps in a new row for each audience you want to create
3. Click on Google Analytics Utilities > Google Analytics 4 > Audiences > Modify.
4. The script will attempt to create a new audience based on the information in each row.


#### Delete



1. After listing your GA4 audiences, navigate to the “GA4 Audiences” sheet.
2. Check the “Delete” box for each audience link you want to delete.
3. Click on Google Analytics Utilities > Google Analytics 4 > Audiences > Modify.
4. The script will attempt to delete the selected audiences.


#### Update



1. After listing your GA4 audiences, navigate to the “GA4 Audiences” sheet.
2. The following can be updated:
    1. Audience Name
    2. Audience Description
3. Check the “Update” box for each audience you want to update.
4. Click on Google Analytics Utilities > Google Analytics 4 > Audience > Modify.
5. The script will attempt to update the selected audience.


### SA360 Links


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve SA360 links.
3. Navigate to the “GA4 SA360 Links” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > SA360 Links > List.
5. The SA360 links for the selected properties will be listed in the “GA4 SA360 Links” sheet.


#### Create



1. Navigate to the “GA4 SA360 Links” sheet.
2. Enter the following:
    1. Property ID
    2. Advertiser ID
    3. True or false for “Ads Personalization Enabled”
    4. True or false for “Campaign Data Sharing Enabled”
    5. True or false for “Cost Data Sharing Enabled”
    6. True or false for “Site States Sharing Enabled”
    7. Check the box for “Create”
    8. Repeat these steps in a new row for each SA360 link you want to create
3. Click on Google Analytics Utilities > Google Analytics 4 > SA360 Links > Modify.
4. The script will attempt to create a new SA360 link based on the information in each row.


#### Delete



1. After listing your GA4 SA360 links, navigate to the “GA4 SA360 Links” sheet.
2. Check the “Delete” box for each SA360 link you want to delete.
3. Click on Google Analytics Utilities > Google Analytics 4 > SA360 Links > Modify.
4. The script will attempt to delete the selected SA360 links.


#### Update



1. After listing your GA4 SA360 links, navigate to the “GA4 SA360 Links” sheet.
2. Edit the following:
    1. Enter true or false for “Ads Personalization Enabled”
    2. Enter true or false for “Site States Sharing Enabled”
3. Check the “Update” box for each SA360 link you want to update.
4. Click on Google Analytics Utilities > Google Analytics 4 > SA360 Links > Modify.
5. The script will attempt to update the selected SA360 links.


### BigQuery Links


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve BigQuery links.
3. Navigate to the “GA4 BigQuery Links” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > BigQuery Links > List.
5. The BigQuery links for the selected properties will be listed in the “GA4 BigQuery Links” sheet.


### Expanded Data Sets


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve expanded data sets.
3. Navigate to the “GA4 Expanded Data Sets” sheet.
4. Click Google Analytics Utilities > Google Analytics 4 > Expanded Data Sets > List.
5. Expanded data sets for the selected properties will be listed in the “GA4 Expanded Data Sets” sheet.


#### Create



1. Navigate to “GA4 Expanded Data Sets”.
2. Enter the following for each expanded data set you want to create:
    1. Property ID
    2. Expanded data set name
    3. Description (optional)
    4. A comma separated list of dimension names
    5. A comma separated list of metric names
    6. A filter expression (optional)
    7. Check the “Create” box
3. Click Google Analytics Utilities > Google Analytics 4 > Expanded Data Sets > Modify.
4. The script will attempt to create new expanded data sets. NOTE: The script will not validate if a given combination of dimensions and metrics can be used in an expanded data set.


#### Update



1. List your expanded data sets.
2. Navigate to “GA4 Expanded Data Sets”.
3. Modify the following for each expanded data set you want to update:
    1. Display Name
    2. Description
    3. Check the “Update” box
4. Click Google Analytics Utilities > Google Analytics 4 > Expanded Data Sets > Modify.
5. The script will attempt to update the expanded data sets.


#### Delete



1. List your expanded data sets.
2. Navigate to “GA4 Expanded Data Sets”.
3. Check the “Delete” box for the expanded data sets you want to delete.
4. Click Google Analytics Utilities > Google Analytics 4 > Expanded Data Sets > Modify.
5. The script will attempt to delete the expanded data sets.


### GA4 Users


#### List



1. List GA4 account summaries.
2. Select the properties from which you want to retrieve access bindings.
3. Navigate to the “GA4 Users” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Users > List.
5. The access bindings for the selected properties will be listed in the “GA4 Users” sheet. Access bindings will only be displayed if the user requesting the information has the necessary permissions. If possible, the access bindings for the accounts associated with each property will also be listed.


#### Create



1. Navigate to the “GA4 Users” sheet.
2. Enter the following in a new row:
    1. Account Access Binding:
        1. Account ID
        2. User Email
        3. Primary permissions - Must be one of the following:
            1. predefinedRoles/viewer
            2. predefinedRoles/analyst
            3. predefinedRoles/editor
            4. predefinedRoles/admin
        4. Secondary Permissions - Can be one of the following:
            5. Blank
            6. predefinedRoles/no-cost-data
            7. predefinedRoles/no-revenue-data
            8. predefinedRoles/no-cost-data, predefinedRoles/no-revenue-data
    2. Property Access Binding:
        5. Account ID
        6. Property ID
        7. User Email
        8. Primary permissions - Must be one of the following:
            9. predefinedRoles/viewer
            10. predefinedRoles/analyst
            11. predefinedRoles/editor
            12. predefinedRoles/admin
        9. Secondary Permissions - Can be one of the following:
            13. Blank
            14. predefinedRoles/no-cost-data
            15. predefinedRoles/no-revenue-data
            16. predefinedRoles/no-cost-data, predefinedRoles/no-revenue-data
3. Check the “Create” box for the row.
4. Click on Google Analytics Utilities > Google Analytics 4 > Users > Modify.
5. The script will attempt to create a new access binding based on the information in each row. Batching is not used.


#### Delete



1. After listing your GA4 access bindings, navigate to the “GA4 Users” sheet.
2. Check the “Delete” box for each access binding you want to delete.
3. Click on Google Analytics Utilities > Google Analytics 4 > Users > Modify.
4. The script will attempt to delete the selected access bindings. Batching is not used.


#### Update



1. After listing your GA4 access bindings, navigate to the “GA4 Users” sheet.
2. The following can be updated:
    1. Primary Permissions
    2. Secondary Permissions
3. Check the “Update” box for each access binding you want to update.
4. Click on Google Analytics Utilities > Google Analytics 4 > Users > Modify.
5. The script will attempt to update the selected access bindings. Batching is not used.


### GA4 Settings Report


#### Create a Report



1. List GA4 account summaries.
2. Select the properties for which you want to generate a report.
3. Navigate to the “GA4 Report Settings” sheet.
4. Enter the information as indicated for rows 4-9.
    1. If the “Template Slides URL” value is left as “Default” or is blank, then the default template will be used. Otherwise, a Google Slides URL of a template presentation must be provided.
    2. If the box for “Request New Settings Information” is checked, then GA Utilities will automatically list new information for several different GA4 sheets. This newly listed information will clear any existing settings listed in the sheets. This includes the following sheets: 
        1. GA4 Property Details
        2. GA4 Audiences
        3. GA4 Data Streams
        4. GA4 Conversions
        5. GA4 Custom Dimensions
        6. GA4 Custom Metrics
        7. GA4 Google Ads Links
        8. GA4 DV360 Links
        9. GA4 Firebase Links
5. The placeholder rows starting at row 10 can be added to, removed, or changed as you prefer. Each column works in the following way:
    1. **Placeholder Text:** This is the placeholder text found in the template spreadsheet. Each placeholder text can only be used once per slide. A placeholder can be whatever you want, but the behavior of the script will change if any of the following words are used:
        1. **percent**: If the word “percent” (all in lowercase) is used in the placeholder, then the value in the slide will be properly formatted as a percent and will change color depending on the information entered for the percent range color scale. The value in the spreadsheet must be a number.
        2. **image, graphic, or logo**: If the image, graphic, or logo (all lowercase) are used in the placeholder, then the value must be a URL that points to an image. The script will then try to swap out the placeholder in the template with the image from the URL.
        3. **list**: If the word “list” is used in the placeholder, then the script will try to create a bulleted list in the slide based on the value in the spreadsheet. The value in the spreadsheet will be split by the presence of double semicolons (;;). For example, the following would be split into two bullet points: <code><em>hello, world;;example list</em></code>. You can either construct a list value in a single line, or you can have multiple rows with the exact same placeholder name and the script will create a list for you from those rows. 
    2. <strong>Template Slide</strong>: The template slide column is used to determine which slide a given placeholder text belongs to. The template slide text must exist in the speaker notes section for a given slide in order for the script to identify the correct slide.
    3. <strong>Include</strong>: Either check the box or use a formula to determine if a placeholder should be considered when building the final presentation.
    4. <strong>Value</strong>: The final value that will appear on the slide where the placeholder text is present.
6. If your template includes one or more slides that need to be duplicated, then you must navigate to the “GA4 Report Settings - Snapshot” sheet and enter settings for those slides. This sheet can be customized in the following way:
    1. Column A: Contains the property ID for a given GA4 property and is included to make it easier to create formulas in other columns.
    2. Column B: Contains the template slide placeholder and is used to identify the template slide.
    3. Columns C+: The headers for these columns should contain the placeholder text that will be swapped with a real value when the report is complete.  Every row after the header should have a value for that specific property. These values can be derived from the other GA Utilities sheets or entered as plain text. The placeholder name rules are the same as previously stated: percent formats the number value as a percent on the slide, list creates a bulleted list, image/graphic/logo uses a provided URL as an image, and any other name just replaces the value on the slide as is.
7. Once all values have been entered, click GA Utilities > Health Report > Create Report
8. Once the health report has been created, a link to the report and the date of its creation will be appended to columns F and G in the “GA4 Report Settings” sheet. The date of creation will default to MM-DD-YYYY format, but that can be reformatted if you so wish.
9. Review the new report and make any necessary adjustments. There may be some placeholders that aren’t removed if said placeholder was not included in the sheet but was present in the template. This is expected and you should delete the placeholder manually. You may also need to adjust image sizes, which is expected.


### Easy Property Creation


#### List



1. List GA4 account summaries.
2. Select the properties you want to use as templates.
3. Navigate to the “GA4 Easy Property Creation” sheet.
4. Click on Google Analytics Utilities > Google Analytics 4 > Easy Property Creation > List Templates.
5. The selected properties and many of their associated settings will be listed in the “GA4 Easy Property Creation” sheet.


#### Create



1. Navigate to the “GA4 Easy Property Creation” sheet.
2. Enter the following in the row for the property you want to make a copy of. If necessary, you can make copy the property settings into multiple rows:
    1. Account ID for New Property 
    2. New Property Name
3. (Optional) If necessary, edit, add, or remove any of the settings in the various columns.
4. Check the “Create” box for each row you want to use to make a property.
5. Click on Google Analytics Utilities > Google Analytics 4 > Easy Property Creation > Create Properties.
6. The script will attempt to create a new property for each selected row and will also create the various settings (i.e. data streams, audiences, conversion events, etc.) in the columns. **Note: Due to limitations with the API, Google Signals will not be enabled in the newly created properties even if the template properties had Google Signals enabled.**
