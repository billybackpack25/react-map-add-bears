import React from 'react';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient
  } from 'react-query'

// Create a client
export const queryClient = new QueryClient()

async function fetchSightings() {
    const response = await fetch('/api/sightings');
    const {sightings} =  await response.json();
    return sightings;
}

async function createSighting(newSighting) {
    const response = await fetch('/api/sightings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sighting: newSighting })
    });
    const {sighting} = await response.json();
    return sighting;
}

export default function Query() {
    const [queryKey] = React.useState('sightings')
    // Access the client
    const queryClient = useQueryClient()
    
    // Queries
    // Cache works off of keys, so the key for this query will be sightings
    // Returns data - renamed to sightings, and errors
    const {data: sightings, error} = useQuery(queryKey, fetchSightings);
    
    const mutation = useMutation(createSighting, {
        //xonSuccess: (data, variables, context) => {
        //    console.log(data, variables, context)
        //    queryClient.setQueryData(queryKey, data)
        //    queryClient.invalidateQueries(queryKey)
        //},
        onMutate: newData => {
            queryClient.cancelQueries(queryKey);
            const current = queryClient.getQueryData(queryKey);
            queryClient.setQueryData(queryKey, (prev) => {
                //console.log('prev',prev);
                return [
                ...prev,
                { ...newData, id: new Date().toISOString() },
            ]});
            return current; // Return current Cache
        },
        onError: (error, newData, rollback) => rollback(),
        onSettled: () => queryClient.invalidateQueries(queryKey)
    });

    if (error) return <span>Error loading data</span>
    if (!sightings) return <span>loading...</span>

    const onSubmit = () => {
        mutation.mutate({latitude: Math.random() * 100,longitude: Math.random() * -100,})
    }

    return (
        <div>
           <button onClick={() => onSubmit()}>add</button>
            <ul>
                {sightings.map((sighting) => (
                    <li key={sighting.id}>
                        {sighting.latitude},{sighting.longitude}
                    </li>
                ))}
            </ul>
        </div>
    );
} 