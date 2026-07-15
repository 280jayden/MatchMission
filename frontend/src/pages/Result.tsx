import { useState, useEffect } from 'react';
import OrgCard from '../components/OrgCard';
import type { Organization } from '../types/organization';
import { GetBatchResponse } from '../types/api';

function Result() {
  const [orgs, setOrgs] = useState<Organization[]>([]);

  // Fetch the user's matched organizations from the backend.
  const getResults = async () => {
    const response = await fetch('/api/get_batch', {
      method: 'GET',
      credentials: 'include',
    });

    const data: GetBatchResponse = await response.json();

    if (response.ok && 'nonprofits' in data) {
      setOrgs(data.nonprofits);
    } else if ('error' in data) {
      console.log(data.error);
    }
  };

  useEffect(() => {
    getResults();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Results</h1>
      <p style={{ textAlign: 'center', marginBottom: '70px' }}>
        Based on your quiz responses, here are some organizations that might fit
        your preferences.
      </p>

      <div className="card-container">
        {orgs.map((org, index) => (
          <OrgCard key={org.ein} org={org} isBestMatch={index < 3} />
        ))}
      </div>
    </div>
  );
}

export default Result;
