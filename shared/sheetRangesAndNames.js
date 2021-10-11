const sheetRanges = {
  ua: {
      viewDetailsList: {
      read: {},
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 22
      }
    },
    customDimensions: {
      read: {},
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 6
      }
    },
    customMetrics: {
      read: {},
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 9
      }
    },
    events: {
      read: {},
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 10
      }
    },
    accountSummaries: {
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 7
      },
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 6
      }
    },
    filters: {
      read: {},
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 26
      }
    },
    audiences: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 18
      },
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 20
      }
    },
    goals: {
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 23
      },
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 22
      }
    },
    settings: {
      read: {
        row: 2,
        column: 2,
        numRows: 3,
        numColumns: 1
      }
    },
    modifyCdsTemplateDimensions: {
      write: {
        row: 12,
        column: 1,
        numRows: 1,
        numColumns: 4
      },
      read: {
        row: 12,
        column: 1,
        numRows: 1,
        numColumns: 5
      }
    },
    modifyCdsTemplateProperty: {
      write: {},
      read: {
        row: 3,
        column: 1,
        numRows: 1,
        numColumns: 4
      }
    },
    modifyCdsSettings: {
      write: {},
      read: {
        row: 5,
        column: 3,
        numRows: 4,
        numColumns: 1
      }
    },
    modifyCdsResults: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 8
      },
      read: {}
    },
    modifyCdsDestinationProperties: {
      write: {
        row: 3,
        column: 7,
        numRows: 1,
        numColumns: 6
      },
      read: {
        row: 3,
        column: 7,
        numRows: 1,
        numColumns: 6
      }
    },
    modifyCmsTemplateMetrics: {
      write: {
        row: 14,
        column: 1,
        numRows: 1,
        numColumns: 7
      },
      read: {
        row: 14,
        column: 1,
        numRows: 1,
        numColumns: 8
      }
    },
    modifyCmsTemplateProperty: {
      write: {},
      read: {
        row: 3,
        column: 3,
        numRows: 1,
        numColumns: 4
      }
    },
    modifyCmsSettings: {
      write: {},
      read: {
        row: 5,
        column: 5,
        numRows: 7,
        numColumns: 1
      }
    },
    modifyCmsResults: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 11
      },
      read: {}
    },
    modifyCmsDestinationProperties: {
      write: {
        row: 3,
        column: 10,
        numRows: 1,
        numColumns: 6
      },
      read: {
        row: 3,
        column: 10,
        numRows: 1,
        numColumns: 6
      }
    },
    metricsRequest: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 16
      },
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 16
      }
    }
  },
  ga4: {
    accountSummaries: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 4
      },
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 5
      }
    },
    streams: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 25
      },
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 26
      }
    },
    customDimensions: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 10
      },
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 13
      }
    },
    customMetrics: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 10
      },
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 13
      }
    },
    conversionEvents: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 8
      },
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 11
      }
    },
    adsLinks: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 11
      },
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 14
      }
    },
    firebaseLinks: {
      write: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 8
      },
      read: {
        row: 2,
        column: 1,
        numRows: 1,
        numColumns: 11
      }
    }
  }
};

const sheetNames = {
  ua: {
    viewDetails: 'View Details List',
    customDimensions: 'UA Custom Dimensions',
    customMetrics: 'UA Custom Metrics',
    events: 'UA Events',
    accountSummaries: 'UA Account Summaries',
    settings: 'UA Settings',
    filters: 'Filters',
    audiences: 'UA Audiences',
    goals: 'Goal Settings',
    modifyCds: 'UA Custom Dimensions - Modify',
    modifyCdsResults: 'UA Custom Dimensions - Modify - Results',
    modifyCms: 'UA Custom Metrics - Modify',
    modifyCmsResults: 'UA Custom Metrics - Modify - Results',
    metricsRequest: 'UA Metrics Request'
  },
  ga4: {
    accountSummaries: 'GA4 Account Summaries',
    streams: 'Data Streams',
    customDimensions: 'GA4 Custom Dimensions',
    customMetrics: 'GA4 Custom Metrics',
    conversionEvents: 'GA4 Conversion Events',
    adsLinks: 'GA4 Google Ads Links',
    firebaseLinks: 'GA4 Firebase Links'
  }
};