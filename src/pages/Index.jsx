import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <header className="bg-orange-500 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Hacker News Top 100</h1>
          <p className="text-lg">Stay updated with the hottest tech stories</p>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-grow">
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto"
          />
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, index) => (
              <Skeleton key={index} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map(story => (
              <Card key={story.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="mb-2">Score: {story.score}</Badge>
                  <p className="text-sm text-gray-500">By {story.by}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={() => window.open(story.url, '_blank')}
                  >
                    Read more
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white mt-8">
        <div className="container mx-auto p-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Hacker News Top 100. All rights reserved.
          </p>
          <p className="text-xs mt-1">
            Powered by the Hacker News API | Built with React and Shadcn
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;