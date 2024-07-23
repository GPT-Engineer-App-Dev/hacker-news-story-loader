import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTopStories();
  }, []);

  const fetchTopStories = async () => {
    try {
      const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const storyIds = await response.json();
      const top100Ids = storyIds.slice(0, 100);
      const storyPromises = top100Ids.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
      );
      const fetchedStories = await Promise.all(storyPromises);
      setStories(fetchedStories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setLoading(false);
    }
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Top 100 Hacker News Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {loading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredStories.map(story => (
            <li key={story.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{story.title}</h2>
              <p className="text-sm text-gray-500">Upvotes: {story.score}</p>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => window.open(story.url, '_blank')}
              >
                Read more
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Index;