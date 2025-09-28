package com.hrushikesh.ecomProducts.repo;

import com.hrushikesh.ecomProducts.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepo extends JpaRepository<Product , Integer> {
}
