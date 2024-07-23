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
  const [currentView, setCurrentView] = useState('grid');

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100">
      <header className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-2 animate-fade-in-down">
            Hacker News Top 100
          </h1>
          <p className="text-xl animate-fade-in-up">
            Stay updated with the hottest tech stories
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-grow">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <Input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mb-4 sm:mb-0"
          />
          <div className="flex space-x-2">
            <Button
              variant={currentView === 'grid' ? 'default' : 'outline'}
              onClick={() => setCurrentView('grid')}
            >
              Grid
            </Button>
            <Button
              variant={currentView === 'list' ? 'default' : 'outline'}
              onClick={() => setCurrentView('list')}
            >
              List
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, index) => (
              <Skeleton key={index} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className={`grid gap-4 ${currentView === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredStories.map((story, index) => (
              <Card 
                key={story.id} 
                className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm animate-fade-in"
                style={{animationDelay: `${index * 50}ms`}}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-800">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="mb-2 bg-orange-100 text-orange-800">Score: {story.score}</Badge>
                  <p className="text-sm text-gray-600">By {story.by}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-pink-500 hover:to-orange-400 transition-all duration-300"
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

      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-8 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">
            © {new Date().getFullYear()} Hacker News Top 100
          </p>
          <p className="text-sm">
            Powered by the Hacker News API | Built with React and Shadcn
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;