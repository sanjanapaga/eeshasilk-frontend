<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Products extends ResourceController
{
    protected $modelName = 'App\Models\ProductModel';
    protected $format    = 'json';

    /**
     * Add image_url to a single product.
     */
    private function addImageUrl($product)
    {
        if ($product && !empty($product['image'])) {
            $product['image_url'] = base_url($product['image']);
        } else if ($product) {
            $product['image_url'] = null;
        }
        return $product;
    }

    /**
     * GET: /api/products
     * Get all products.
     */
    public function index()
    {
        $products = $this->model->findAll();

        // Add the full image_url to each product
        $productsWithUrls = array_map(function ($product) {
            return $this->addImageUrl($product);
        }, $products);

        return $this->respond($productsWithUrls);
    }

    /**
     * GET: /api/products/{id}
     * Get a single product.
     */
    public function show($id = null)
    {
        $product = $this->model->find($id);
        if ($product) {
            return $this->respond($this->addImageUrl($product));
        }
        return $this->failNotFound('No product found with id: ' . $id);
    }

    /**
     * POST: /api/products
     * Create a new product.
     */
    public function create()
    {
        $data = [
            'name'           => $this->request->getPost('name'),
            'description'    => $this->request->getPost('description'),
            'price'          => $this->request->getPost('price'),
            'discount'       => $this->request->getPost('discount'),
            'category'       => $this->request->getPost('category'),
            'stock_quantity' => $this->request->getPost('stock_quantity'),
        ];

        $img = $this->request->getFile('image');

        if ($img && $img->isValid() && !$img->hasMoved()) {
            $uploadPath = FCPATH . 'uploads/products';

            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0775, true);
            }

            $newName = $img->getRandomName();
            $img->move($uploadPath, $newName);

            // Store relative path in the 'image' field
            $data['image'] = 'uploads/products/' . $newName;
        }

        $id = $this->model->insert($data);

        if (!$id) {
            return $this->fail($this->model->errors());
        }

        $product = $this->model->find($id);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Product created successfully',
            'product' => $this->addImageUrl($product)
        ]);
    }

    /**
     * PUT: /api/products/{id}
     * Update a product.
     */
    public function update($id = null)
    {
        $product = $this->model->find($id);
        if (!$product) {
            return $this->failNotFound('Product not found with id: ' . $id);
        }

        // Use getRawInput() to handle multipart/form-data with PUT, fallback to getPost() for method spoofing
        $data = $this->request->getRawInput();
        if (empty($data)) {
            $data = $this->request->getPost();
            unset($data['_method']);
        }

        $file = $this->request->getFile('image');

        if ($file && $file->isValid() && !$file->hasMoved()) {
            $newName = $file->getRandomName();
            $uploadPath = FCPATH . 'uploads/products';
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0775, true);
            }
            $file->move($uploadPath, $newName);
            
            // Store relative path
            $data['image'] = 'uploads/products/' . $newName;

            // Delete old image if it exists
            if (!empty($product['image'])) {
                $oldPath = FCPATH . $product['image'];
                if (file_exists($oldPath) && is_file($oldPath)) {
                    unlink($oldPath);
                }
            }
        }

        if ($this->model->update($id, $data) === false) {
            return $this->fail($this->model->errors());
        }

        $updatedProduct = $this->model->find($id);
        
        return $this->respond([
            'status'  => 200,
            'message' => 'Product updated successfully',
            'product' => $this->addImageUrl($updatedProduct)
        ]);
    }
}
