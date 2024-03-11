import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../api';
import Button from './Button';
import Input from './Input';
import ProductList from './ProductList';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 50;
    const [productPages, setProductPages] = useState({});
    const [filters, setFilters] = useState({ product: '', price: null, brand: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [uniqueIds, setUniqueIds] = useState([]);
    const [filteredIds, setFilteredIds] = useState([]);
    const [isFilterApplied, setIsFilterApplied] = useState(false);

    useEffect(() => {
        fetchUniqueProductIds();
    }, []);

    const fetchUniqueProductIds = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProducts('get_ids', {});
            if (response && response.result) {
                const Ids = response.result.map(JSON.stringify);
                const uniqueIdsSet = new Set(Ids);
                const uniqueIdsArray = Array.from(uniqueIdsSet, JSON.parse);
                setUniqueIds(uniqueIdsArray);
            } else {
                setUniqueIds([]);
            }
        } catch (error) {
            console.error('Error fetching product IDs:', error);
        }
        setIsLoading(false);
    };

    const fetchFilteredProductIds = async (appliedFilters) => {
        setIsLoading(true);
        setProductPages({});
        
        try {
          const response = await fetchProducts('filter', appliedFilters);
          if (response && response.result) {
            const filteredIds = [...new Set(response.result)];
            setFilteredIds(filteredIds);
            setIsFilterApplied(true);
          } else {
            setFilteredIds([]);
            setIsFilterApplied(false);
          }
        } catch (error) {
          console.error('Error fetching filtered product IDs:', error);
        }
        setIsLoading(false);
      };

    useEffect(() => {
        if ((isFilterApplied ? filteredIds.length : uniqueIds.length) > 0) {
            const offset = currentPage * itemsPerPage;
            fetchAndSetProducts(offset);
        }
    }, [currentPage, uniqueIds, filteredIds, isFilterApplied]);

    const fetchAndSetProducts = async (offset = 0) => {
        setIsLoading(true);
        let currentIds = isFilterApplied ? filteredIds.slice(offset, offset + itemsPerPage) : uniqueIds.slice(offset, offset + itemsPerPage);

        const cacheKey = isFilterApplied ? `filtered_${JSON.stringify(filters)}_${offset}` : `default_${offset}`;
        if (productPages[cacheKey]) {
            setProducts(productPages[cacheKey]);
            setIsLoading(false);
            return;
        }

        try {
            const itemsResult = await fetchProducts('get_items', { ids: currentIds });
            if (itemsResult && itemsResult.result) {
                const productsMap = new Map(itemsResult.result.map(item => [item.id, item]));
                const uniqueProducts = Array.from(productsMap.values());
                setProducts(uniqueProducts);
                setProductPages(prevPages => ({ ...prevPages, [cacheKey]: uniqueProducts }));
            }
        } catch (error) {
            console.error('API Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const applyFilters = async () => {
        setCurrentPage(0);
        const appliedFilters = {...filters};
        if (appliedFilters.price && typeof appliedFilters.price === 'string') {
          appliedFilters.price = Number(appliedFilters.price);
          if (isNaN(appliedFilters.price)) {
            appliedFilters.price = null;
          }
        }
      
        fetchFilteredProductIds(appliedFilters);
      };

    const resetSearch = () => {
        setFilters({ product: '', price: null, brand: '' });
        setIsFilterApplied(false);
        setFilteredIds([]);
        setCurrentPage(0);
        fetchUniqueProductIds(); // Загружаем исходный список продуктов
    };

    const handlePrevPage = () => setCurrentPage(Math.max(0, currentPage - 1));
    const handleNextPage = () => setCurrentPage(currentPage + 1);

    return (
        <div className='md:container md:mx-auto'>
            <div className='flex flex-row justify-center gap-4 p-4'>
                <Input name="product" value={filters.product} onChange={handleFilterChange} placeholder="Product Name" />
                <Input name="price" type="number" value={filters.price || ''} onChange={handleFilterChange} placeholder="Price" />
                <Input name="brand" value={filters.brand} onChange={handleFilterChange} placeholder="Brand" />
                <Button onClick={applyFilters}>Apply Filters</Button>
                <Button onClick={resetSearch} isResetButton={true}>Reset Search</Button>
            </div>
            {isLoading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <ProductList products={products} />
            )}
            <div className='flex justify-center gap-2 p-4'>
                <Button onClick={handlePrevPage} disabled={currentPage === 0}>Prev</Button>
                <Button onClick={handleNextPage} disabled={currentPage >= Math.ceil((isFilterApplied ? filteredIds.length : uniqueIds.length) / itemsPerPage) - 1}>Next</Button>
            </div>
            <span>Page {currentPage + 1} of {Math.ceil((isFilterApplied ? filteredIds.length : uniqueIds.length) / itemsPerPage)}</span>
        </div>
    );
};

export default Products;
