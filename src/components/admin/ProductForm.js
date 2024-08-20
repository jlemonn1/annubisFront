// src/components/ProductForm.js
import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import './admin.css';

const ProductForm = forwardRef(({ productToEdit, onSave }, ref) => {
    const [product, setProduct] = useState({
        name: '',
        category: '',
        description: '',
        price: 0,
        size: '',
        color: '',
        urlImg: []
    });

    const [sizeNotAvailable, setSizeNotAvailable] = useState(false);
    const [colorNotAvailable, setColorNotAvailable] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        if (productToEdit) {
            setProduct(productToEdit);
            setSizeNotAvailable(productToEdit.size === 'NOSIZE');
            setColorNotAvailable(productToEdit.color === 'NOCOLOR');
        } else {
            setProduct({
                name: '',
                category: '',
                description: '',
                price: 0,
                size: '',
                color: '',
                urlImg: []
            });
            setSizeNotAvailable(false);
            setColorNotAvailable(false);
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'sizeNotAvailable') {
            setSizeNotAvailable(checked);
            setProduct({ ...product, size: checked ? 'NOSIZE' : '' });
        } else if (name === 'colorNotAvailable') {
            setColorNotAvailable(checked);
            setProduct({ ...product, color: checked ? 'NOCOLOR' : '' });
        }
    };

    const uploadFiles = async (files) => {
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('category', product.category);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('size', product.size);
        formData.append('color', product.color);
        formData.append('cat', product.category);
        files.forEach(file => formData.append('images', file));
    
        const url = productToEdit
            ? `/api/products/${productToEdit.id}`
            : '/api/products';
    
        const method = productToEdit ? 'put' : 'post';
    
        try {
            const response = await axios[method](url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response from server:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error during product upload:', error.response ? error.response.data : error.message);
            throw error;
        }
    };
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selectedFiles.length > 0) {
                await uploadFiles(selectedFiles);
            }

            onSave();
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    const scrollToForm = () => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <form className="admin-form" onSubmit={handleSubmit} ref={ref}>
            <label>
                Nombre:
                <input type="text" name="name" value={product.name} onChange={handleChange} required />
            </label>
            <label>
                Categoría:
                <input type="text" name="category" value={product.category} onChange={handleChange} required />
            </label>
            <label>
                Descripción:
                <textarea name="description" value={product.description} onChange={handleChange} required />
            </label>
            <label>
                Precio:
                <input type="number" name="price" value={product.price} onChange={handleChange} required />
            </label>
            <label>
                Tamaño:
                <input
                    type="text"
                    name="size"
                    placeholder="Varios entre comas, no disp -talla"
                    value={product.size}
                    onChange={handleChange}
                />
                <div className="admin-checkbox-container">
                    <input
                        type="checkbox"
                        name="sizeNotAvailable"
                        checked={sizeNotAvailable}
                        onChange={handleCheckboxChange}
                    />
                    <span>No Disponible</span>
                </div>
            </label>
            <label>
                Color:
                <input
                    type="text"
                    name="color"
                    placeholder="Varios entre comas, no disp -color"
                    value={product.color}
                    onChange={handleChange}
                />
                <div className="admin-checkbox-container">
                    <input
                        type="checkbox"
                        name="colorNotAvailable"
                        checked={colorNotAvailable}
                        onChange={handleCheckboxChange}
                    />
                    <span>No Disponible</span>
                </div>
            </label>
            <label>
                Imagenes:
                <input type="file" multiple onChange={handleFileChange} />
            </label>
            <button className="admin-button" type="submit" onClick={scrollToForm}>Guardar</button>
        </form>
    );
});

export default ProductForm;
