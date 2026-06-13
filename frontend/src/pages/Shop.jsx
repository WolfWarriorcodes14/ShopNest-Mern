import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [allCategories, setAllCategories] = useState([]);

  // Fetch all products initially to extract categories
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const categories = [...new Set(data.map(p => p.category))];
        setAllCategories(categories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllProducts();
  }, []);

  // Fetch filtered products based on selected filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products?';
        if (selectedCategory !== 'all') {
          url += `category=${selectedCategory}&`;
        }
        url += `minPrice=${minPrice}&maxPrice=${maxPrice}`;
        
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setMinPrice(0);
    setMaxPrice(10000);
    setSearch('');
  };

  return (
    <div className="shop-container">
      <h2>All Products</h2>
      
      <div className="shop-wrapper">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>Filters</h3>
            
            {/* Category Filter */}
            <div className="filter-group">
              <h4>Category</h4>
              <div className="category-filters">
                <label>
                  <input 
                    type="radio" 
                    name="category" 
                    value="all"
                    checked={selectedCategory === 'all'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  All Categories
                </label>
                {allCategories.map(category => (
                  <label key={category}>
                    <input 
                      type="radio" 
                      name="category" 
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-filter">
                <label>
                  Min Price: ₹{minPrice}
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    step="100"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="price-slider"
                  />
                </label>
                <label>
                  Max Price: ₹{maxPrice}
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="price-slider"
                  />
                </label>
              </div>
            </div>

            {/* Reset Filters */}
            <button className="reset-filters-btn" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Products Section */}
        <div className="products-section">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar"
          />
          {loading ? (
            <div className="loading">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
