package com.hrushikesh.ecomProducts.service;

import com.hrushikesh.ecomProducts.model.Product;
import com.hrushikesh.ecomProducts.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
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
        return productRepo.findById(id).orElse(new Product(-1));
    }

    // save product with image
    public Product addOrUpdateProduct(Product product, MultipartFile image) throws IOException {

        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        product.setImageData(image.getBytes());


        return productRepo.save(product);
    }

    public void deleteProductById(int id) {
        productRepo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return productRepo.searchProducts(keyword);
    }
}
