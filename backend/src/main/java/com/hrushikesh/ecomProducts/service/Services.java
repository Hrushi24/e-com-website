package com.hrushikesh.ecomProducts.service;

import com.hrushikesh.ecomProducts.model.Product;
import com.hrushikesh.ecomProducts.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Services {

    @Autowired
    ProductRepo productRepo;


    public List<Product> findAll() {
        return productRepo.findAll();
    }

    public void addProduct(Product pr) {
        productRepo.save(pr);
    }


    public Product findById(int id) {
        return productRepo.findById(id).orElse(new Product());
    }

}
