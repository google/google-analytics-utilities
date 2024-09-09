# Copyright 2024 Google LLC
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

"""Loops through the uploaded CSV file to publish pub/sub messages.

Parses uploaded CSV files to publish pub/sub messages that contain data to
eventually create Google Analytics resources.

"""

import os
import json
import time
import pandas
import functions_framework
from enum import Enum
from typing import Dict
from google.cloud import storage
from google.cloud import pubsub_v1
from cloudevents.http import CloudEvent

class ResourceType(Enum):
    ADS_LINK = 'ads_link'
    DV360_LINK = 'dv360_link'
    DV360_LINK_PROPOSAL = 'dv360_link_proposal' 

# Set to slightly less than 1 hour so that the function can upload
# a new CSV to the input bucket if it is close to timing out.
TIMEOUT = 3500

@functions_framework.cloud_event
def main(cloud_event: CloudEvent) -> str:
    """Gets the CSV file uploaded to the specified Cloud Storage bucket and
    loops through the contents. Each row in the file should cause a pub/sub
    message to be published containing data to create a Google Analytics
    resource.

    Args:
        cloud_event: The event containing meta information about the file
        uploaded to the Cloud Storage bucket.

    Returns:
        An string indicating whether or not the function has invoked another
        instance of itself by uploading the remaining CSV file values.
    """
    start_time = time.time()
    bucket = cloud_event.data['bucket']
    name = cloud_event.data['name']
    file_name = 'gs://' + bucket + '/' + name
    df = pandas.read_csv(file_name, on_bad_lines='skip')
    records = df.to_dict('records')
    enable_logging = str_to_bool(os.environ.get('ENABLE_LOGGING'))
    event_data = {
        'client_id': os.environ.get('CLIENT_ID'),
        'client_secret': os.environ.get('CLIENT_SECRET'),
        'refresh_token': os.environ.get('REFRESH_TOKEN'),
        'token_uri': os.environ.get('TOKEN_URI'),
        'scopes': ['https://www.googleapis.com/auth/analytics.edit'],
        'enable_logging': enable_logging}
    for index, row in enumerate(records):
        if time.time() - start_time < TIMEOUT:
            for resource in ResourceType:
                if resource.value in name:
                    topic = f'projects/{os.environ.get("PROJECT_ID")}/topics/ga_{resource.value}'
                    encoded_data = json.dumps(event_data | row).encode('utf-8')
                    pubsub_v1.PublisherClient().publish(topic, encoded_data)
                    time.sleep(.2)
        else:
            current_row = index + 1
            remaining = df.iloc[current_row:,:]
            remaining_csv = pandas.DataFrame(remaining).to_csv()
            remaining_blob = storage.Client().get_bucket(bucket).blob(
                f'remaining-{time.time()}.csv')
            remaining_blob.upload_from_string(
                remaining_csv, content_type='text/csv')
            if (enable_logging):
                print('continuing')
            return 'continuing'
        if (enable_logging):
            print('done')
        return 'done'


def str_to_bool(value: str|None):
    """Converts the string "true" to the boolean type. Everything else is
    returned as False.

    Args:
        value: The value to be converted to a boolean.

    Returns:
        Either True or False as boolean types.
    """
    if value.strip().lower() == 'true':
        return True
    else:
        return False
