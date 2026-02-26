import { useCallback, useEffect, useState } from 'react';
import { getProjects } from '../services/projectsService';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setProjects(await getProjects());
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Could not load projects. Ensure Firebase is configured.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  return {
    projects,
    loading,
    error,
    refreshProjects,
  };
}
