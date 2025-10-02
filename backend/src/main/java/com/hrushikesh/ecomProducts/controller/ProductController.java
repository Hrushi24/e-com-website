package com.hrushikesh.ecomProducts.controller;

import com.hrushikesh.ecomProducts.model.Product;
import com.hrushikesh.ecomProducts.service.Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.http.HttpResponse;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ProductController {

    @Autowired
    Services productServices;


    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts(){
        return new ResponseEntity<>(productServices.findAll(), HttpStatus.ACCEPTED);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable int id){
        Product product = productServices.findById(id);

        if (product.getId() > 0){
            return new ResponseEntity<>(productServices.findById(id) , HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    // Takes product without image

//    @PostMapping("/products")
//    public Product addProduct(@RequestPart Product pr){
//        productServices.addProduct(pr);
//        return productServices.findById(pr.getId());
//    }

    // Takes product with image , using @Requestpart and MultipartFile

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestPart Product product , @RequestPart MultipartFile imageFile){
        Product productTemp = null;
        try {
            productTemp = productServices.addProduct(product , imageFile);
            return new ResponseEntity<>(productTemp , HttpStatus.ACCEPTED);
        } catch (IOException e) {
            System.out.println(e.getMessage());
            System.out.println(e.toString());
            return new ResponseEntity<>(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
