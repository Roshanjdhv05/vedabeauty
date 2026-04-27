import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import { ChevronLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Fuse from 'fuse.js';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        
        if (query) {
          // 1. Create a unified search string for each product
          const searchData = data.map(p => ({
            ...p,
            _searchText: `${p.name} ${p.brand} ${p.category} ${p.description}`
          }));

          // 2. Configure Fuse.js to search this combined text
          const options = {
            keys: ['_searchText'],
            threshold: 0.3, // Optimal for typos
            distance: 100,
            ignoreLocation: true,
            useExtendedSearch: true // Required for logical operators
          };

          const fuse = new Fuse(searchData, options);
          const searchWords = query.trim().split(/\s+/).filter(Boolean);
          
          let searchResult = [];
          
          if (searchWords.length > 0) {
            // 3. Every word must match somewhere in the combined text (fuzzy allowed)
            const logicalQuery = {
              $and: searchWords.map(word => ({ _searchText: word }))
            };
            searchResult = fuse.search(logicalQuery);
          }

          // 4. Extract original items
          setResults(searchResult.map(res => {
            const item = { ...res.item };
            delete item._searchText; // Clean up
            return item;
          }));
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    window.scrollTo(0, 0);
  }, [query]);

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-4 mb-4 md:mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40">
            <span className="cursor-pointer hover:text-black" onClick={() => navigate('/')}>Home</span>
            <span>/</span>
            <span className="text-black">Search Results</span>
          </div>
        </div>

        {/* Search Header */}
        <div className="mb-6 md:mb-16">
          <p className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-2 md:mb-4">
            Search Results for
          </p>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-black uppercase tracking-tighter leading-none break-words">
            "{query}"
          </h1>
          <div className="flex items-center gap-4 mt-4 md:mt-6">
            <div className="h-px w-20 bg-black" />
            <p className="text-[10px] font-bold text-black uppercase tracking-[0.3em]">
              Found {results.length} professional matches
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, j) => (
              <div key={j} className="aspect-[3/4] bg-white/50 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8"
          >
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-black/5 px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search size={32} className="text-gray-200" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-black">No matches found</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              We couldn't find any products matching your search. Try different keywords or browse our categories.
            </p>
            <button 
              onClick={() => navigate('/categories')}
              className="mt-8 px-8 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-accent transition-colors"
            >
              Browse Categories
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchResults;
