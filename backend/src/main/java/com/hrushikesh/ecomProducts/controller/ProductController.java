package com.hrushikesh.ecomProducts.controller;

import com.hrushikesh.ecomProducts.model.Product;
import com.hrushikesh.ecomProducts.service.Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @PostMapping("/products")
    public Product addProduct(@RequestBody Product pr){
        productServices.addProduct(pr);
        return productServices.findById(pr.getId());
    }

//    @DeleteMapping("/products/${id}")
//    public ResponseEntity<String> deleteProduct(@PathVariable int id){
//        productServices.removeProduct(id);
//        return new ResponseEntity<>( "Deleted", HttpStatus.OK);
//    }


}
