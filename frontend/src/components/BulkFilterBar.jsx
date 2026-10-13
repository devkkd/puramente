'use client';

import React, { useEffect, useState } from 'react';
import { useBulkProduct } from '@/context/BulkProductContext';
import './BulkFilterBar.css';

/**
 * BulkFilterBar Component
 * 
 * Provides filtering interface for bulk product operations:
 * - Category filter dropdown
 * - Search by productName and designCode
 * - Toggle filters for bestSeller and newArrival status
 * - Integrated with Redux/Context store
 */
export default function BulkFilterBar({
  onFiltersChange = () => {},
  onProductsFetch = () => {}
}) {
  const { state, actions } = useBulkProduct();

  // Local state for filters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    bestSeller: false,
    newArrival: false
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch available categories on component mount
   */
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Fetch categories from API
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        throw new Error('Invalid categories data format');
      }

    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle search input change
   */
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    const updatedFilters = {
      ...filters,
      search: searchValue
    };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  /**
   * Handle category filter change
   */
  const handleCategoryChange = (e) => {
    const categoryValue = e.target.value;
    const updatedFilters = {
      ...filters,
      category: categoryValue
    };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  /**
   * Handle bestSeller toggle
   */
  const handleBestSellerToggle = () => {
    const updatedFilters = {
      ...filters,
      bestSeller: !filters.bestSeller
    };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  /**
   * Handle newArrival toggle
   */
  const handleNewArrivalToggle = () => {
    const updatedFilters = {
      ...filters,
      newArrival: !filters.newArrival
    };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  /**
   * Apply filters and notify parent component
   */
  const applyFilters = (appliedFilters) => {
    onFiltersChange(appliedFilters);
  };

  /**
   * Reset all filters
   */
  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      category: '',
      bestSeller: false,
      newArrival: false
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
    // Clear selection when filters are reset
    actions.clearSelection();
  };

  return (
    <div className="bulk-filter-bar">
      <div className="filter-container">
        
        {/* Search Input */}
        <div className="filter-group">
          <label htmlFor="search-input" className="filter-label">
            Search Products
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="Search by name or design code..."
            value={filters.search}
            onChange={handleSearchChange}
            className="filter-input search-input"
            aria-label="Search products by name or design code"
          />
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category-select" className="filter-label">
            Category
          </label>
          <select
            id="category-select"
            value={filters.category}
            onChange={handleCategoryChange}
            className="filter-select"
            disabled={loading}
            aria-label="Filter by product category"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {error && <span className="filter-error">{error}</span>}
        </div>

        {/* Best Seller Toggle */}
        <div className="filter-group filter-checkbox-group">
          <label className="filter-label checkbox-label">
            <input
              type="checkbox"
              checked={filters.bestSeller}
              onChange={handleBestSellerToggle}
              className="filter-checkbox"
              aria-label="Filter by best seller status"
            />
            <span className="checkbox-text">Best Sellers</span>
          </label>
        </div>

        {/* New Arrival Toggle */}
        <div className="filter-group filter-checkbox-group">
          <label className="filter-label checkbox-label">
            <input
              type="checkbox"
              checked={filters.newArrival}
              onChange={handleNewArrivalToggle}
              className="filter-checkbox"
              aria-label="Filter by new arrival status"
            />
            <span className="checkbox-text">New Arrivals</span>
          </label>
        </div>

        {/* Reset Button */}
        <div className="filter-group">
          <button
            onClick={handleResetFilters}
            className="filter-button reset-button"
            aria-label="Reset all filters"
          >
            Reset Filters
          </button>
        </div>

      </div>

      {/* Active Filters Summary */}
      <div className="active-filters">
        {(filters.search || filters.category || filters.bestSeller || filters.newArrival) && (
          <div className="filters-summary">
            <span className="summary-label">Active Filters:</span>
            {filters.search && (
              <span className="filter-tag">
                Search: "{filters.search}"
              </span>
            )}
            {filters.category && (
              <span className="filter-tag">
                Category: {categories.find(c => c._id === filters.category)?.name || filters.category}
              </span>
            )}
            {filters.bestSeller && (
              <span className="filter-tag">Best Sellers</span>
            )}
            {filters.newArrival && (
              <span className="filter-tag">New Arrivals</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
