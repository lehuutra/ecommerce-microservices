package com.ecommerce.product.service;

import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.ProductResponse;
import com.ecommerce.product.dto.CategoryResponse;
import com.ecommerce.product.entity.Category;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.exception.BusinessException;
import com.ecommerce.product.repository.CategoryRepository;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductResponse create(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new BusinessException(
                        "Category not found", HttpStatus.NOT_FOUND));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .category(category)
                .build();

        product = productRepository.save(product);
        return toResponse(product);
    }

    public List<ProductResponse> getAll() {
        return productRepository.findByStatus(Product.Status.ACTIVE)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        "Product not found", HttpStatus.NOT_FOUND));

        // Thêm: sản phẩm INACTIVE coi như không tồn tại với customer
        if (product.getStatus() == Product.Status.INACTIVE) {
            throw new BusinessException("Product not found", HttpStatus.NOT_FOUND);
        }

        return toResponse(product);
    }

    public List<ProductResponse> search(String name) {
        // Đổi sang method mới có filter status
        return productRepository.findByNameContainingIgnoreCaseAndStatus(
                        name, Product.Status.ACTIVE)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        "Product not found", HttpStatus.NOT_FOUND));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new BusinessException(
                        "Category not found", HttpStatus.NOT_FOUND));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);

        product = productRepository.save(product);
        return toResponse(product);
    }

    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        "Product not found", HttpStatus.NOT_FOUND));

        product.setStatus(Product.Status.INACTIVE);
        productRepository.save(product);
    }

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .status(product.getStatus().name())
                .category(CategoryResponse.builder()
                        .id(product.getCategory().getId())
                        .name(product.getCategory().getName())
                        .description(product.getCategory().getDescription())
                        .build())
                .build();
    }
}
