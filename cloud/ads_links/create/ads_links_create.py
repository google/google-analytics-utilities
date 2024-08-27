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

"""Creates a new Google Analytics and Ads link.

Creates an Ads link based on the request JSON when the Cloud Function is
invoked from a Cloud Pub/Sub topic.

"""

import functions_framework
import google.oauth2.credentials
from typing import List, Dict
from google.analytics.admin import AnalyticsAdminServiceClient
from google.analytics.admin_v1alpha.types import GoogleAdsLink


@functions_framework.cloud_event
def main(cloud_event: Dict[str, str]) -> GoogleAdsLink|Dict[str, str|int]:
    """Cloud Function that creates Google Ads links in Google Analytics.

    Args:
        cloud_event: The cloud event data containing values that will be used
        to create the Google Ads link.

    Returns:
        The response or error object.
    """
    data = cloud_event.data
    ga_client = get_ga_client(
        data['refresh_token'],
        data['token_uri'],
        data['client_id'],
        data['client_secret'],
        data['scopes'])
    ads_link = GoogleAdsLink(
        customer_id=data['customer_id'],
        ads_personalization_enabled=data['ads_personalization_enabled'])
    response = ga_client.create_google_ads_link(
        parent=data['parent'],
        google_ads_link=ads_link)
    if data['enable_logging']:
        print(response)
    return response


def get_ga_client(
    refresh_token: str,
    token_uri: str,
    client_id: str,
    client_secret: str,
    scopes: List[str]) -> type[AnalyticsAdminServiceClient]:
    """Creates the Google Analytics Admin API client.

    Args:
        refresh_token: The OAuth 2.0 refresh token.
        token_uri: The OAuth 2.0 authorization server’s token endpoint URI.
        client_id: The OAuth 2.0 client ID.
        client_secret: The OAuth 2.0 client secret.
        scopes: The OAuth 2.0 permission scopes.

    Returns:
        The Google Analytics Admin API client.
    """
    credentials = google.oauth2.credentials.Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri=token_uri,
        client_id=client_id,
        client_secret=client_secret,
        scopes=scopes)
    return AnalyticsAdminServiceClient(credentials=credentials)