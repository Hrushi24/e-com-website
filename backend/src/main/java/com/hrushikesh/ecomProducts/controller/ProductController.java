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
            productTemp = productServices.addOrUpdateProduct(product , imageFile);
            return new ResponseEntity<>(productTemp , HttpStatus.OK);
        } catch (IOException e) {
            System.out.println(e.getMessage());
            System.out.println(e.toString());
            return new ResponseEntity<>(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{productId}/image")
    public ResponseEntity<byte[]> sendImage(@PathVariable int productId){
        Product product = productServices.findById(productId);

        if (product.getId() > 0 ){
            return new ResponseEntity<>(product.getImageData() , HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    // update product information only
    @PutMapping("products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable int id, @RequestBody Product product) {
        Product updateProduct = productServices.findById(id);
        updateProduct.setName(product.getName());
        updateProduct.setCategory(product.getCategory());
        updateProduct.setDescription(product.getDescription());
        updateProduct.setPrice(product.getPrice());


        productServices.addProduct(updateProduct);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    //Only accepting image when it is added to update form.
    @PutMapping("/{id}/image")
    public ResponseEntity<?> updateImage(@PathVariable int id , @RequestPart("image") MultipartFile imageFile){
        Product updateImage = null;
        try {
            updateImage = productServices.addOrUpdateProduct(productServices.findById(id) , imageFile);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
        }

    }


}
