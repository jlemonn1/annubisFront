// src/components/ProductList.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductItem from './ProductItem';
import ScrollToForm from './ScrollToForm';
import './admin.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsFormVisible(true);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8080/api/products/${id}`);
        fetchProducts();
    };

    const handleSave = () => {
        setEditingProduct(null);
        setIsFormVisible(false);
        fetchProducts();
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsFormVisible(true);
    };

    return (
        <div className="admin-container">
            <button className="admin-button" onClick={handleAddNew}>Añadir nuevo</button>
            <ScrollToForm isVisible={isFormVisible} />
            {isFormVisible && (
                <ProductForm ref={formRef} productToEdit={editingProduct} onSave={handleSave} />
            )}
            <ul className="admin-list">
                {products.map(product => (
                    <ProductItem
                        key={product.id}
                        product={product}
                        onEdit={() => handleEdit(product)}
                        onDelete={() => handleDelete(product.id)}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
