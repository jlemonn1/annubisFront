import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import './FeaturedProducts.css'; // Asegúrate de importar el CSS para el contenedor de productos

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const productRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2, // 20% del elemento está visible
      }
    );

    productRefs.current.forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [products]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="featured-products">
      {products.map((product, index) => (
        <div
          key={product.id} // Utiliza el ID del producto en lugar del índice
          className="product-card-wrapper"
          ref={el => productRefs.current[index] = el}
        >
          <ProductCard 
            title={product.name}
            price={product.price}
            image={`data:image/jpeg;base64,${product.images[0]}`} // Tomar la primera imagen del array de imágenes en base64
            onClick={() => handleProductClick(product.id)} // Llama a handleProductClick con el ID del producto
          />
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
