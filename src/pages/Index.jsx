import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <header className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-12 shadow-lg relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-6xl font-bold mb-4 animate-text-glow">
            Hacker News Top 100
          </h1>
          <p className="text-2xl animate-float">
            Stay updated with the hottest tech stories
          </p>
        </div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-30 animate-gradient-x"></div>
      </header>

      <main className="container mx-auto p-8 flex-grow">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="relative w-full max-w-md mb-4 sm:mb-0">
            <Input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-orange-300 focus:border-pink-500 transition-all duration-300"
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <Tabs defaultValue="grid" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="grid" onClick={() => setCurrentView('grid')}>Grid</TabsTrigger>
              <TabsTrigger value="list" onClick={() => setCurrentView('list')}>List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 ${currentView === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredStories.map((story, index) => (
              <Card 
                key={story.id} 
                className="hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden animate-fade-in transform hover:-translate-y-1"
                style={{animationDelay: `${index * 50}ms`}}
              >
                <CardHeader className="bg-gradient-to-r from-orange-400 to-pink-500 text-white">
                  <CardTitle className="text-lg font-bold truncate">{story.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Badge variant="secondary" className="mb-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full">Score: {story.score}</Badge>
                  <p className="text-sm text-gray-600">By {story.by}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-pink-500 hover:to-orange-400 transition-all duration-300 transform hover:scale-105"
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

      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-2xl font-semibold mb-4 animate-pulse">
            © {new Date().getFullYear()} Hacker News Top 100
          </p>
          <p className="text-md">
            Powered by the Hacker News API | Built with React and Shadcn
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;