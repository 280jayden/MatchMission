import FilterChip from '../components/FilterChip';
import categories from "../data/categories.json"
import "../styles/Directory.css"
import { useState, useEffect } from 'react';
import OrgCard from '../components/OrgCard';
import LoadingText from '../components/LoadingText';
import { API_URL } from '../config';
import { GetOrgsResponse } from '../types/api';
import { Organization } from '../types/organization';


function Directory() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch random orgs
    const getAnyOrg = async () => { //This is a debug for now while i wait for other endpoint to be created
      setLoading(true);
        const response = await fetch(`${API_URL}/api/orgs/directory`, {
            method: 'GET',
            credentials: 'include',
        });

        const data: GetOrgsResponse = await response.json();

        if (response.ok && 'directory' in data) {
            setOrgs(data.directory);
            console.log(data.directory);
        } else if ('error' in data) {
            console.log(data.error);
        }

        setLoading(false);
    };
    
    const loadMore = async () => {
      setLoadingMore(true);
      const response = await fetch(`${API_URL}/api/orgs/directory`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ filters: Array.from(selectedFilters), 
            exclude_eins: orgs.map(org => org.ein) }),
        });

      const data: GetOrgsResponse = await response.json();

      if (response.ok && 'directory' in data) {
            setOrgs(prev => [...prev, ...data.directory]);
            console.log(data.directory);
        } else if ('error' in data) {
            console.log(data.error);
        }

      setLoadingMore(false);
    }

    const toggleFilter = (filter: string) => {
      setSelectedFilters(prev => {
        const next = new Set(prev);
        next.has(filter) ? next.delete(filter) : next.add(filter);
        console.log("selected a new filter so we have " + Array.from(next));
        return next;
      })
    }

    const applyFilters = async () => { //Later this will work for an empty array to just get random ones again
      // any of the selected buttons, add to filters array
      // run the backend call to update the orgs
      setLoading(true);
      const response = await fetch(`${API_URL}/api/orgs/directory`, { //CHANGETHISCALLLATER
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ filters: Array.from(selectedFilters)}),
        });

      const data: GetOrgsResponse = await response.json();

      if (response.ok && 'directory' in data) {
            setOrgs(data.directory);
            console.log(data.directory);
        } else if ('error' in data) {
            console.log(data.error);
        }

        setLoading(false);
    }



    useEffect(() => {
        getAnyOrg();
    }, []);

    return (
        <div className="directory-container">
          {/* FILTERS */}
            <div className="filter-bar">
                <h2 style={{marginBottom: '0', marginTop:'30px'}}>FILTERS</h2>
                <button className="apply-button" onClick={applyFilters}>Apply Filters</button>
                {categories.map((category) => (
                        <FilterChip
                        key={category.tag}
                        title={category.name}
                        tagImageUrl={category.tagImageUrl}
                        isSelected={selectedFilters.has(category.tag)}
                        onSelect={()=> toggleFilter(category.tag)}
                        />
                        ))}
                <button className="apply-button" onClick={applyFilters}>Apply Filters</button>
            </div>
            
            {/* ORGANIZATION CONTAINER */}
            <div className="directory-orgs page-background">
              <h1 style={{ textAlign: 'center'}}>Directory</h1>
                { loading ? ( <LoadingText fullscreen={false}></LoadingText>) : (
                  <>
                    <div className="card-container">
                        {orgs.map((org, index) => (
                          <OrgCard key={org.ein} org={org} isBestMatch={false} />
                        ))}
                    </div>
                    <div className="load-button-container">
                      <button onClick={loadMore} disabled={loadingMore}>
                        {loadingMore ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  </>
                )}
            </div>
        </div>
    );
}

export default Directory;
