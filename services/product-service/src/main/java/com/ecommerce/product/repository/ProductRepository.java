package com.ecommerce.product.repository;

import com.ecommerce.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByStatus(Product.Status status);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByStatusOrderByCreatedAtDesc(Product.Status status);
    List<Product> findByNameContainingIgnoreCaseAndStatus(String name, Product.Status status);
}
