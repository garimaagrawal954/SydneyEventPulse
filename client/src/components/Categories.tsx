import React from 'react';

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface CategoriesProps {
  categories: Category[];
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
}

export default function Categories({ categories, selectedCategory, setSelectedCategory }: CategoriesProps) {
  const getIconClass = (color: string) => {
    const colors: { [key: string]: string } = {
      'blue': 'bg-blue-100 text-primary',
      'purple': 'bg-purple-100 text-purple-700',
      'orange': 'bg-orange-100 text-orange-700',
      'green': 'bg-green-100 text-green-700',
      'pink': 'bg-pink-100 text-pink-700',
      'indigo': 'bg-indigo-100 text-indigo-700'
    };
    
    return colors[color] || 'bg-gray-100 text-gray-700';
  };
  
  const getIconSvg = (icon: string) => {
    switch (icon) {
      case 'music_note':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
        );
      case 'palette':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r="0.5"></circle>
            <circle cx="17.5" cy="10.5" r="0.5"></circle>
            <circle cx="8.5" cy="7.5" r="0.5"></circle>
            <circle cx="6.5" cy="12.5" r="0.5"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
          </svg>
        );
      case 'restaurant':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 11a2 2 0 0 1 2 2v8H7v-8a2 2 0 0 1 2-2zM2 11h3v10H2z"></path>
            <path d="M19 5h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1l0 0V5zM14 8h.01"></path>
            <path d="M17 5h.01"></path>
            <path d="M14 11h.01"></path>
            <path d="M17 11h.01"></path>
            <path d="M19 17v4h-7"></path>
          </svg>
        );
      case 'sports_soccer':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v4h4"></path>
            <path d="M7 10l3 3"></path>
            <path d="M7 14l5-1"></path>
          </svg>
        );
      case 'theater_comedy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        );
      case 'laptop':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="12" rx="2"></rect>
            <rect x="6" y="12" width="12" height="0.01"></rect>
            <path d="M7 20h10"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        );
    }
  };
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Explore by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={`bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all cursor-pointer ${selectedCategory === category.name ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedCategory && setSelectedCategory(category.name)}
            >
              <div className={`${getIconClass(category.color)} rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                {getIconSvg(category.icon)}
              </div>
              <h3 className="font-semibold">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
