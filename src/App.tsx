import React, { useEffect } from 'react';
import { SearchProvider, Results, SearchBox, PagingInfo, ResultsPerPage, Paging, Facet } from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import { SearchDriverOptions, FacetConfiguration } from "@elastic/search-ui";

const ELASTICSEARCH_URL = import.meta.env.VITE_ELASTICSEARCH_URL || 'http://localhost:9200';
console.log(ELASTICSEARCH_URL, 'ELASTICSEARCH_URL')

const connector = new ElasticsearchAPIConnector({
  host: ELASTICSEARCH_URL,
  index: "cv-transcriptions",
  connectionOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
  }
});

const testConnection = async () => {
  try {
    const response = await fetch(ELASTICSEARCH_URL);
    console.log('Elasticsearch connection test response:', response);
    if (!response.ok) {
      console.error('Failed to connect to Elasticsearch');
    }
  } catch (error) {
    console.error('Error connecting to Elasticsearch:', error);
  }
};

const config: SearchDriverOptions = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    search_fields: {
      generated_text: {}
    },
    result_fields: {
      generated_text: { 
        raw: {},
        snippet: {
          size: 100,
          fallback: true
        }
      },
      duration: { raw: {} },
      age: { raw: {} },
      gender: { raw: {} },
      accent: { raw: {} }
    },
    facets: {
      age: { type: "value" } as FacetConfiguration,
      gender: { type: "value" } as FacetConfiguration,
      accent: { type: "value" } as FacetConfiguration,
      duration: {
        type: "range",
        ranges: [
          { from: 0, to: 5, name: "0-5s" },
          { from: 5, to: 10, name: "5-10s" },
          { from: 10, to: null, name: "10s+" }
        ]
      } as FacetConfiguration
    }
  }
};

const App: React.FC = () => {
  useEffect(() => {
    testConnection();
    
    console.log('Current Elasticsearch URL:', ELASTICSEARCH_URL);
    console.log('Search configuration:', config);
  }, []);

  return (
    <SearchProvider 
      config={{
        ...config,
        debug: true
      }}
    >
      <Layout
        header={<SearchBox debounceLength={0} />}
        bodyContent={
          <Results
            titleField="generated_text"
            shouldTrackClickThrough={true}
            className="text-black"
          />
        }
        bodyHeader={
          <>
            <PagingInfo />
            <ResultsPerPage />
          </>
        }
        bodyFooter={<Paging />}
        sideContent={
          <div>
            <Facet field="accent" label="Accent" />
            <Facet field="gender" label="Gender" />
            <Facet field="age" label="Age" />
            <Facet field="duration" label="Duration" />
          </div>
        }
      />
    </SearchProvider>
  );
};

export default App;