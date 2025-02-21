import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';

function TestApi() {
    const [data, setData] = useState({
        writings: [],
        paintings: [],
        photography: [],
        music: []
    });
    const { loading, error, handleRequest } = useApi();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [writings, paintings, photography, music] = await Promise.all([
                    handleRequest(apiService.getAllWritings),
                    handleRequest(apiService.getAllPaintings),
                    handleRequest(apiService.getAllPhotography),
                    handleRequest(apiService.getAllMusic)
                ]);

                setData({
                    writings,
                    paintings,
                    photography,
                    music
                });
            } catch (err) {
                console.error('Failed to fetch data:', err);
            }
        };

        fetchAllData();
    }, [handleRequest]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>API Test Results</h2>
            
            <section>
                <h3>Writings ({data.writings.length})</h3>
                <pre>{JSON.stringify(data.writings, null, 2)}</pre>
            </section>

            <section>
                <h3>Paintings ({data.paintings.length})</h3>
                <pre>{JSON.stringify(data.paintings, null, 2)}</pre>
            </section>

            <section>
                <h3>Photography ({data.photography.length})</h3>
                <pre>{JSON.stringify(data.photography, null, 2)}</pre>
            </section>

            <section>
                <h3>Music ({data.music.length})</h3>
                <pre>{JSON.stringify(data.music, null, 2)}</pre>
            </section>
        </div>
    );
}

export default TestApi;