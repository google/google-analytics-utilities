# Copyright 2023 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import functions_framework
import os
import io
import time
import pandas
import google.oauth2.credentials
from google.analytics.admin import AnalyticsAdminServiceClient
from google.analytics.admin_v1alpha.types import GoogleAdsLink
from google.analytics.admin_v1alpha.types import DisplayVideo360AdvertiserLink
from google.analytics.admin_v1alpha.types import DisplayVideo360AdvertiserLinkProposal
from google.cloud import storage

storage_client = storage.Client()

OUTPUT_BUCKET = os.environ.get('OUTPUT_BUCKET')
CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
ACCESS_TOKEN = os.environ.get('ACCESS_TOKEN')
REFRESH_TOKEN = os.environ.get('REFRESH_TOKEN')
TOKEN_URI = os.environ.get('TOKEN_URI')
REQUEST_DELAY = .2


@functions_framework.cloud_event
def main(cloud_event):
    start_time = time.time()
    data = cloud_event.data
    ga_client = get_ga_client()
    bucket = data['bucket']
    name = data['name']
    file_name = 'gs://' + bucket + '/' + name
    df = pandas.read_csv(file_name, on_bad_lines='skip')
    records = df.to_dict('records')
    print(records)
    responses = []
    for index, row in enumerate(records):
        if time.time() - start_time < 348000000:
            if row['request_type'] == 'ads':
                try:
                    customer_id = str(row['ads_customer_id'])
                    parent = f"properties/{row['ga4_property_id']}"
                    response = ga_client.create_google_ads_link(
                        parent=parent,
                        google_ads_link=GoogleAdsLink(
                            customer_id=customer_id,
                            ads_personalization_enabled=row['ads_personalization_enabled']))
                    responses.append({
                        'ga_propety_id': row['ga4_property_id'],
                        'platform_id': customer_id,
                        'type': 'ads',
                        'link_resource_name': response.name,
                        'result': 'created'})
                except Exception as e:
                    responses.append({
                        'ga_propety_id': row['ga4_property_id'],
                        'platform_id': customer_id,
                        'type': 'ads',
                        'link_resource_name': 'n/a',
                        'result': e})
                time.sleep(REQUEST_DELAY)
            if row['request_type'] == 'dv360':
                try:
                    advertiser_id = str(row['dv360_advertiser_id'])
                    parent = f"properties/{row['ga4_property_id']}"
                    dv360_link = DisplayVideo360AdvertiserLink(
                        advertiser_id=advertiser_id,
                        ads_personalization_enabled = row['ads_personalization_enabled'],
                        campaign_data_sharing_enabled = row['dv360_campaign_data_sharing_enabled'],
                        cost_data_sharing_enabled = row['dv360_cost_data_sharing_enabled'])
                    response = ga_client.create_display_video360_advertiser_link(
                        parent=parent,
                        display_video360_advertiser_link=dv360_link)
                    responses.append({
                        'ga_propety_id': row['ga4_property_id'],
                        'platform_id': advertiser_id,
                        'type': 'dv360',
                        'link_resource_name': response.name,
                        'result': 'created'})
                except Exception as e:
                    responses.append({
                        'ga_propety_id': row['ga4_property_id'],
                        'platform_id': advertiers_id,
                        'type': 'dv360',
                        'link_resource_name': 'n/a',
                        'result': e})
                time.sleep(REQUEST_DELAY)
            if row['request_type'] == 'dv360_link_proposal':
                try:
                    advertiser_id = str(row['dv360_advertiser_id'])
                    parent = f"properties/{row['ga4_property_id']}"
                    dv360_link_proposal = DisplayVideo360AdvertiserLinkProposal(
                        advertiser_id=advertiser_id,
                        ads_personalization_enabled = row['ads_personalization_enabled'],
                        campaign_data_sharing_enabled = row['dv360_campaign_data_sharing_enabled'],
                        cost_data_sharing_enabled = row['dv360_cost_data_sharing_enabled'],
                        validation_email = row['dv360_proposal_validation_email'])
                    response = ga_client.create_display_video360_advertiser_link(
                        parent=parent,
                        display_video360_advertiser_link_proposal=dv360_link_proposal)
                    responses.append({
                        'ga_propety_id': row['ga4_property_id'],
                        'platform_id': advertiser_id,
                        'type': 'dv360 link proposal',
                        'link_resource_name': response.name,
                        'result': 'created'})
                except Exception as e:
                    responses.append({
                        'ga_propety_id': row['ga4_property_id'],
                        'platform_id': advertiers_id,
                        'type': 'dv360 link proposal',
                        'link_resource_name': 'n/a',
                        'result': e})
                time.sleep(REQUEST_DELAY)
        else:
            current_row = index + 1
            remaining = df.iloc[current_row:,:]
            remaining_csv = pandas.DataFrame(remaining).to_csv()
            remaining_blob = storage_client.get_bucket(bucket).blob(f'remaining-{time.time()}.csv')
            remaining_blob.upload_from_string(remaining_csv, content_type='text/csv')
            break;
    csv_str = pandas.DataFrame(responses).to_csv()
    output_bucket_blob = storage_client.get_bucket(OUTPUT_BUCKET).blob(f'results-{time.time()}.csv')
    output_bucket_blob.upload_from_string(csv_str, content_type='text/csv')



def get_ga_client():
    credentials = google.oauth2.credentials.Credentials(
        ACCESS_TOKEN,
        refresh_token=REFRESH_TOKEN,
        token_uri=TOKEN_URI,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET)
    return AnalyticsAdminServiceClient(credentials=credentials)
