// ShowDetail component
'use client';

import React, { useEffect, useState } from 'react'
import { NextPage } from 'next';
import { fetchShowDetails } from './fetchShowDetails.server';

interface ShowDetailProps {
  params: {
    id: string;
  };
}

interface ShowDetails {
  title: string;
  overview: string;
}

const ShowDetail: NextPage<ShowDetailProps> = ({ params }) => {
  const [showDetails, setShowDetails] = useState<ShowDetails>({
    title: '',
    overview: ''
  });
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchShowDetails(params.id);
      setShowDetails(data);
      setIsLoading(false);
    }
  
    loadData();
  }, [params.id]);

  return (
    <div className='text-white mx-auto my-8 flex flex-col items-center w-1/2'>
    {isLoading ? (
      <div className="spinner"></div>
    ) : (
      <>
        <h1>Show: {params.id}</h1>
        <h2>Show details</h2>
        <p>{showDetails.title}</p>
        <p>{showDetails.overview}</p>
      </>
    )}
  </div>
  )
}

export default ShowDetail;
