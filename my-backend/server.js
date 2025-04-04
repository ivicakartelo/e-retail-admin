require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { validationResult, check } = require('express-validator'); // Fix: Import validation utilities
const path = require('path');
const PDFDocument = require('pdfkit');

const apiKey = process.env.GOOGLE_API_KEY;
console.log('API Key:', apiKey);

// Import the Google Generative AI library
const { GoogleGenerativeAI } = require('@google/generative-ai');


// Initialize the Google AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Use GOOGLE_API_KEY from .env
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' }); // Use the corre

// Define the recommendProducts function
const recommendProducts = async ({ category }) => {
  if (!category) {
    console.error('Category is missing in request!');
    return [];
  }

  console.log(`Requesting recommendations for: ${category}`);

  try {
    const prompt = `Suggest 3 popular products for the category: ${category}`;
    const result = await model.generateContent(prompt); // Generate content using the model
    const response = await result.response; // Get the response
    const text = response.text(); // Extract the text

    console.log('AI Response:', text);
    return text.split('\n').filter((line) => line.trim() !== '');
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

// Export the function for use in Express
module.exports = { recommendProducts };

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/assets/images', express.static(path.join(__dirname, 'public/assets/images')));

// Convert the callback style connection methods to promise-based
const queryAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Configure Multer to save images in the public/assets/images folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const dir = path.join(__dirname, 'public/assets/images');
      cb(null, dir);
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e_retail'
});

db.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

// Reusable function for error handling
const handleQueryError = (res, error, rollback = false, connection = null) => {
  if (rollback && connection) connection.rollback(() => connection.release());
  console.error(error);
  return res.status(500).json({ error: 'Database query error', details: error.message });
};

const fs = require('fs');

// Cleanup route
app.delete('/cleanupImages', (req, res) => {
    const folderPath = path.join(__dirname, 'public/assets/images');

    // Step 1: Get all filenames from the `images` folder
    const filesInFolder = fs.readdirSync(folderPath);

    // Step 2: Get all image filenames from the database
    const query = 'SELECT image_1, image_2 FROM article';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching image data from the database:', error);
            return res.status(500).json({ error: 'Database query error.' });
        }

        // Step 3: Extract image filenames from the database results
        const imageFilenamesInDB = [];
        results.forEach(row => {
            if (row.image_1) imageFilenamesInDB.push(row.image_1);
            if (row.image_2) imageFilenamesInDB.push(row.image_2);
        });

        // Step 4: Identify images in the folder that are not in the database
        const imagesToDelete = filesInFolder.filter(file => !imageFilenamesInDB.includes(file));

        // Step 5: Delete the identified images
        imagesToDelete.forEach(file => {
            const filePath = path.join(folderPath, file);
            fs.unlinkSync(filePath);
            console.log(`Deleted: ${file}`);
        });

        res.status(200).json({
            message: 'Cleanup complete.',
            deletedImages: imagesToDelete,
        });
    });
});

// Departments Routes
app.get('/departments', (req, res) => {
    db.query('SELECT * FROM department', (error, results) => {
        if (error) return res.status(500).json({ error });
        res.status(200).json(results);
    });
});


app.post('/departments', (req, res) => {
    const { name, description } = req.body;
    db.query('INSERT INTO department (name, description) VALUES (?, ?)', [name, description], (error, results) => {
        if (error) { 
            return res.status(500).json({ error });
        }
        res.status(201).json({ department_id: results.insertId });
    });
});


app.put('/departments/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
        console.error('Missing required fields: name or description');
        return res.status(400).json({ error: 'Name and description are required.' });
    }

    db.query('UPDATE department SET name = ?, description = ? WHERE department_id = ?', [name, description, id], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error });
        }
        res.status(204).end();
        console.log(name)
    });
});
app.delete('/departments/:id', (req, res) => {
  const { id } = req.params;

  // Update the deleted_at column to mark the record as deleted
  db.query(
      'UPDATE department SET deleted_at = NOW() WHERE department_id = ?', 
      [id], 
      (error, results) => {
          if (error) return res.status(500).json({ error });

          // Check if a row was affected (i.e., if the department_id exists)
          if (results.affectedRows === 0) {
              return res.status(404).json({ error: 'Department not found.' });
          }

          res.status(204).end(); // Return no content on successful deletion
      }
  );
});

// Categories Routes
app.get('/categories', (req, res) => {
    db.query('SELECT * FROM category', (error, results) => {
        if (error) return res.status(500).json({ error });
        console.log(results);
        res.status(200).json(results);
    });
});

app.post('/categories', (req, res) => {  // Corrected route definition
    const { department_id, name, description } = req.body;
    db.query('INSERT INTO category (department_id, name, description) VALUES (?, ?, ?)', [department_id, name, description], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.status(201).json({ category_id: results.insertId, department_id, name, description });
    });
});

app.delete('/categories/:id', (req, res) => {
  const { id } = req.params;

  // Soft delete: set the `deleted_at` column to the current timestamp
  db.query(
      'UPDATE category SET deleted_at = NOW() WHERE category_id = ?', 
      [id], 
      (error, results) => {
          if (error) {
              return res.status(500).json({ error });
          }

          // Check if a row was affected (i.e., the category_id exists)
          if (results.affectedRows === 0) {
              return res.status(404).json({ error: 'Category not found.' });
          }

          res.status(204).end(); // Return no content on successful deletion
      }
  );
});

app.put('/categories/:id', (req, res) => {
    const { id } = req.params;
    const { department_id, name, description } = req.body;

    if (!department_id || !name || !description) {
        console.error('Missing required fields: name or description');
        return res.status(400).json({ error: 'department_id and Name and description are required.' });
    }

    db.query('UPDATE category SET department_id = ?, name = ?, description = ? WHERE category_id = ?', [department_id, name, description, id], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error });
        }
        res.status(200).json({ id, department_id, name, description });
        console.log(id, department_id, name, description)
    });
});

// Articles Routes

// Get all articles
app.get('/articles', (req, res) => {
    db.query('SELECT * FROM article', (error, results) => {
      if (error) return res.status(500).json({ error });
      res.status(200).json(results);
    });
  });

// Get article by ID including its associated categories
app.get('/articles/:id', (req, res) => {
    const { id } = req.params;

    const query = `
      SELECT 
        a.article_id, a.name, a.description, a.image_1, a.image_2, 
        a.promotion_at_homepage_level, a.promotion_at_department_level,
        GROUP_CONCAT(ca.category_id) AS category_ids
      FROM 
        article a
      LEFT JOIN 
        category_article ca ON a.article_id = ca.article_id
      WHERE 
        a.article_id = ?
    `;

    db.query(query, [id], (error, results) => {
        if (error) return res.status(500).json({ error });

        if (results.length > 0) {
            const article = results[0];
            article.category_ids = article.category_ids ? article.category_ids.split(',').map(Number) : [];
            res.status(200).json(article);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    });
});

// New route to get associated categories
app.get('/articles/:id/categories', (req, res) => {
    const articleId = req.params.id;
  
    const query = `
      SELECT c.category_id, c.name AS category_name
      FROM category c
      JOIN category_article ca ON c.category_id = ca.category_id
      WHERE ca.article_id = ?;
    `;
  
    db.query(query, [articleId], (error, results) => {
      if (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ error: 'An error occurred while fetching categories.' });
      }
      res.status(200).json({ categories: results });
    });
  });

//New route to get no-associated categories
app.get('/articles/:id/no-associate-categories', (req, res) => {
  const articleId = req.params.id;

  const query = `
      SELECT c.category_id, c.name AS category_name
      FROM category c
      LEFT JOIN category_article ca ON c.category_id = ca.category_id AND ca.article_id = ?
      WHERE ca.category_id IS NULL
  `;

  db.query(query, [articleId], (error, results) => {
      if (error) {
          console.error('Error fetching non-associated categories:', error);
          return res.status(500).json({ error: 'An error occurred while fetching categories.' });
      }
      res.status(200).json({ categories: results });
  });
});

// Articles Routes
app.post(
    '/articles',
    upload.fields([
      { name: 'image_1', maxCount: 1 },
      { name: 'image_2', maxCount: 1 },
    ]),
    [
      check('name').notEmpty().withMessage('Name is required.'),
      check('description').notEmpty().withMessage('Description is required.'),
      check('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number.'),
      check('category_ids').isString().withMessage('Category IDs must be a JSON string.'),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { 
        name, 
        description, 
        price, 
        promotion_at_homepage_level = 0, 
        promotion_at_department_level = 0 
      } = req.body;
  
      const image_1 = req.files?.image_1?.[0]?.filename || null;
      const image_2 = req.files?.image_2?.[0]?.filename || null;
  
      let category_ids;
      try {
        category_ids = JSON.parse(req.body.category_ids || '[]');
      } catch (err) {
        return res.status(400).json({ error: 'Invalid category_ids format. Must be a JSON array.' });
      }
  
      if (!category_ids.length) {
        return res.status(400).json({ error: 'At least one category ID is required.' });
      }
  
      // Begin transaction
      db.beginTransaction((transErr) => {
        if (transErr) return handleQueryError(res, transErr);
  
        // Insert the article with the price field
        const insertArticleQuery = `
          INSERT INTO article 
          (name, description, price, image_1, image_2, promotion_at_homepage_level, promotion_at_department_level)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
  
        db.query(
          insertArticleQuery,
          [name, description, price, image_1, image_2, promotion_at_homepage_level, promotion_at_department_level],
          (insertErr, results) => {
            if (insertErr) {
              return db.rollback(() => handleQueryError(res, insertErr));
            }
  
            const articleId = results.insertId;
            const categoryArticleValues = category_ids.map((category_id) => [category_id, articleId]);
  
            // Insert categories associated with the article
            const insertCategoryArticleQuery = `
              INSERT INTO category_article (category_id, article_id) 
              VALUES ?
            `;
  
            db.query(insertCategoryArticleQuery, [categoryArticleValues], (categoryErr) => {
              if (categoryErr) {
                return db.rollback(() => handleQueryError(res, categoryErr));
              }
  
              // Commit the transaction
              db.commit((commitErr) => {
                if (commitErr) {
                  return handleQueryError(res, commitErr);
                }
  
                res.status(201).json({ id: articleId, name });
              });
            });
          }
        );
      });
    }
  );  

// Update an existing article
app.put(
    '/articles/:id',
    upload.fields([
        { name: 'image_1', maxCount: 1 },
        { name: 'image_2', maxCount: 1 },
    ]),
    (req, res) => {
        const { id } = req.params;
        const {
            name,
            description,
            price, // Add price to destructure from request body
            promotion_at_homepage_level,
            promotion_at_department_level,
        } = req.body;

        // Validate required fields
        if (!name || !description || price === undefined) {
            return res.status(400).json({ error: 'Name, description, and price are required.' });
        }

        const image_1 = req.files?.image_1?.[0]?.filename || null;
        const image_2 = req.files?.image_2?.[0]?.filename || null;

        const updateQuery = `
            UPDATE article 
            SET 
                name = ?, 
                description = ?, 
                price = ?, -- Add price to the SQL update query
                image_1 = COALESCE(?, image_1), 
                image_2 = COALESCE(?, image_2), 
                promotion_at_homepage_level = ?, 
                promotion_at_department_level = ? 
            WHERE article_id = ?
        `;

        db.query(
            updateQuery,
            [
                name,
                description,
                price, // Include price in the query parameters
                image_1,
                image_2,
                promotion_at_homepage_level,
                promotion_at_department_level,
                id,
            ],
            (error) => {
                if (error) {
                    console.error('Error updating article:', error);
                    return res.status(500).json({ error: 'Failed to update article.' });
                }
                res.status(200).json({ message: 'Article updated successfully' });
            }
        );
    }
);

// Soft delete an article
app.delete('/articles/:id', (req, res) => {
  const { id } = req.params;

  // Soft delete: set the `deleted_at` column to the current timestamp
  db.query(
      'UPDATE article SET deleted_at = NOW() WHERE article_id = ?', 
      [id], 
      (error, results) => {
          if (error) {
              console.error('Database error:', error);
              return res.status(500).json({ error });
          }

          // Check if the article exists (affectedRows > 0)
          if (results.affectedRows === 0) {
              return res.status(404).json({ error: 'Article not found.' });
          }

          res.status(204).end(); // Successfully soft-deleted the article
      }
  );
});

// New route to remove categories associated with an article
app.delete('/articles/:id/remove-categories', (req, res) => {
    const articleId = req.params.id;
    const { category_ids } = req.body;
  
    if (!category_ids || category_ids.length === 0) {
      return res.status(400).json({ error: 'No categories provided for removal.' });
    }
  
    const query = `DELETE FROM category_article WHERE article_id = ? AND category_id IN (?)`;
  
    db.query(query, [articleId, category_ids], (error, results) => {
      if (error) {
        console.error('Error removing categories:', error);
        return res.status(500).json({ error: 'An error occurred while removing categories.' });
      }
  
      res.status(200).json({ message: 'Categories removed successfully.' });
    });
  });
  
  //New route to insert new categories no-associated with an article
  app.post('/articles/:id/assign-categories', (req, res) => {
    const articleId = req.params.id;
    const { category_ids } = req.body;

    if (!category_ids || category_ids.length === 0) {
        return res.status(400).json({ error: 'No categories selected for assignment.' });
    }

    const categoryArticleValues = category_ids.map((category_id) => [category_id, articleId]);

    // Insert selected categories into category_article
    db.query(
        'INSERT INTO category_article (category_id, article_id) VALUES ?',
        [categoryArticleValues],
        (error, results) => {
            if (error) {
                console.error('Error assigning categories:', error);
                return res.status(500).json({ error: 'An error occurred while assigning categories.' });
            }
            res.status(201).json({ message: 'Categories assigned successfully.' });
        }
    );
});

// Users Routes

// Get all users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (error, results) => {
      if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ error });
      }
      res.status(200).json(results);
  });
});

// Add a new user
app.post('/users', (req, res) => {
  const { name, email, password, role, delivery_address, billing_address  } = req.body;

  if (!name || !email || !password || !role) {
      console.error('Missing required fields: name, email, password, or role');
      return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role, delivery_address, billing_address],
      (error, results) => {
          if (error) {
              console.error('Database error:', error);
              return res.status(500).json({ error });
          }
          res.status(201).json({ user_id: results.insertId  });
      }
  );
});

// Update an existing user
app.put('/users/:id', (req, res) => {
  console.log("Received data:", req.body); // Debugging line
  const { id } = req.params;
  const { name, email, role, delivery_address, billing_address } = req.body;

  if (!name || !email || role === undefined || !delivery_address || !billing_address) {
    console.error('Missing required fields: name, email, role, delivery_address, or billing_address');
    return res.status(400).json({ error: 'Name, email, role, delivery address, and billing address are required.' });
  }

  db.query(
    'UPDATE users SET name = ?, email = ?, role = ?, delivery_address = ?, billing_address = ? WHERE user_id = ?', 
    [name, email, role, delivery_address, billing_address, id],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully' });
    }
  );
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  // Soft delete: set the `deleted_at` column to the current timestamp
  db.query(
      'UPDATE users SET deleted_at = NOW() WHERE user_id = ?', 
      [id], 
      (error, results) => {
          if (error) {
              console.error('Database error:', error);
              return res.status(500).json({ error });
          }

          // Check if a row was affected (i.e., the user_id exists)
          if (results.affectedRows === 0) {
              return res.status(404).json({ error: 'User not found.' });
          }

          res.status(204).end(); // Return no content on successful deletion
      }
  );
});

// Get all orders
app.get('/orders', (req, res) => {
  db.query('SELECT * FROM orders WHERE deleted_at IS NULL', (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
});

// Add a new order
app.post('/orders', (req, res) => {
  const { user_id, status, total_amount } = req.body;

  if (!user_id || !total_amount) {
    console.error('Missing required fields: user_id or total_amount');
    return res.status(400).json({ error: 'User ID and total amount are required.' });
  }

  db.query(
    'INSERT INTO orders (user_id, status, total_amount) VALUES (?, ?, ?)',
    [user_id, status || 'pending', total_amount],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error });
      }
      res.status(201).json({ order_id: results.insertId, user_id, status: status || 'pending', total_amount });
    }
  );
});

// Update an existing order
app.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status, total_amount } = req.body;

  if (!status && !total_amount) {
    console.error('No fields provided to update.');
    return res.status(400).json({ error: 'At least one field (status or total_amount) is required to update.' });
  }

  const fields = [];
  const values = [];
  if (status) {
    fields.push('status = ?');
    values.push(status);
  }
  if (total_amount) {
    fields.push('total_amount = ?');
    values.push(total_amount);
  }
  values.push(id);

  const query = `UPDATE orders SET ${fields.join(', ')} WHERE order_id = ?`;

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error });
    }
    res.status(204).end();
  });
});

// Soft delete an order
app.delete('/orders/:id', (req, res) => {
  const { id } = req.params;

  db.query('UPDATE orders SET deleted_at = NOW() WHERE order_id = ?', [id], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error });
    }
    res.status(204).end();
  });
});

// Restore a soft-deleted order (optional endpoint)
app.put('/orders/restore/:id', (req, res) => {
  const { id } = req.params;

  db.query('UPDATE orders SET deleted_at = NULL WHERE order_id = ?', [id], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error });
    }
    res.status(204).end();
  });
});

// Get all order items
app.get('/order-items', (req, res) => {
  db.query('SELECT * FROM order_items', (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
});

// Add a new order item
app.post('/order-items', (req, res) => {
  const { order_id, article_id, quantity, price } = req.body;

  // Validate required fields
  if (!order_id || !article_id || !quantity || !price) {
    console.error('Missing required fields');
    return res.status(400).json({ error: 'Order ID, Article ID, Quantity, and Price are required.' });
  }

  db.query(
    'INSERT INTO order_items (order_id, article_id, quantity, price) VALUES (?, ?, ?, ?)',
    [order_id, article_id, quantity, price],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error });
      }
      res.status(201).json({
        order_item_id: results.insertId,
        order_id,
        article_id,
        quantity,
        price
      });
    }
  );
});

// Update an existing order item
app.put('/order-items/:id', (req, res) => {
  const { id } = req.params; // Get the ID of the order item to update
  const { quantity, price } = req.body; // Get the new quantity and/or price from the request body

  // Validate that at least one field (quantity or price) is provided
  if (!quantity && !price) {
    console.error('No fields provided to update.');
    return res.status(400).json({ error: 'At least one field (quantity or price) is required to update.' });
  }

  // Prepare the dynamic query based on provided fields
  const fields = [];
  const values = [];
  if (quantity) {
    fields.push('quantity = ?');
    values.push(quantity);
  }
  if (price) {
    fields.push('price = ?');
    values.push(price);
  }
  values.push(id); // Add the ID as the last parameter for the WHERE clause

  // Construct the SQL query
  const query = `UPDATE order_items SET ${fields.join(', ')} WHERE order_item_id = ?`;

  // Execute the query
  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error }); // Return an error if the query fails
    }

    if (results.affectedRows === 0) {
      // No rows updated means the order item ID was not found
      return res.status(404).json({ error: 'Order item not found.' });
    }

    // Success - Return a 200 response with a success message
    res.status(200).json({ message: 'Order item updated successfully.' });
  });
});

// Delete an order item permanently
app.delete('/order-items/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM order_items WHERE order_item_id = ?', [id], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error });
    }
    res.status(204).end();
  });
});

// Update order status (Admin)
app.put('/orders/update-status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; // Example: "processing", "shipped", "delivered"

  try {
    // Valid statuses that an order can have
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

    // Check if the provided status is valid
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Your SQL query to update the order status
    const updateOrderQuery = "UPDATE orders SET status = ? WHERE order_id = ?";
    
    // Execute the query using queryAsync
    await queryAsync(updateOrderQuery, [status, orderId]);

    // Return success response
    res.json({ message: 'Order status updated', orderId, status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all orders for Admin
app.get('/orders/all-orders', async (req, res) => {
  try {
    // Query to get all orders ordered by order date
    const selectAllOrdersQuery = 'SELECT * FROM orders ORDER BY order_date DESC';
    
    // Execute the query using queryAsync
    const orders = await queryAsync(selectAllOrdersQuery);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user orders (Customer)
app.get('/orders/user-orders/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Query to get orders by user ID, ordered by order date
    const selectUserOrdersQuery = 'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC';
    
    // Execute the query using queryAsync
    const orders = await queryAsync(selectUserOrdersQuery, [userId]);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/invoice/:orderId', async (req, res) => {
  const { orderId } = req.params;
  console.log(`Generating invoice for order ID: ${orderId}`);

  try {
    // Fetch order details
    const orderRows = await queryAsync(
      `SELECT o.*, 
              u.name AS user_name, 
              u.email AS user_email,
              u.delivery_name, u.delivery_street, u.delivery_city, u.delivery_state, u.delivery_country, u.delivery_zip_code,
              u.billing_name, u.billing_street, u.billing_city, u.billing_state, u.billing_country, u.billing_zip_code
       FROM orders o
       JOIN users u ON o.user_id = u.user_id
       WHERE o.order_id = ?`,
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderRows[0];
    
    // Fetch order items
    const items = await queryAsync(
      `SELECT oi.*, a.name AS article_name 
       FROM order_items oi
       JOIN article a ON oi.article_id = a.article_id 
       WHERE oi.order_id = ?`,
      [orderId]
    );

    // Ensure owner company exists
    await queryAsync(`
      CREATE TABLE IF NOT EXISTS owner_company (
        company_id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        website VARCHAR(100) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (company_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await queryAsync(`
      INSERT INTO owner_company (name, address, email, phone, website) 
      SELECT * FROM (SELECT 'E-Retail Inc.', '123 Commerce St, Online City, EC 45678', 'contact@e-retail.com', '+1234567890', 'https://www.e-retail.com') AS tmp
      WHERE NOT EXISTS (
        SELECT 1 FROM owner_company
      ) LIMIT 1;
    `);

    const ownerData = await queryAsync("SELECT * FROM owner_company LIMIT 1");
    const owner = ownerData[0] || {};

    if (!owner.company_id) {
      return res.status(500).json({ message: 'Owner company details missing in database' });
    }

    // Set headers for inline PDF display
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="invoice_${orderId}.pdf"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Create PDF document and pipe directly to response
    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(res);

    // Add content to PDF
    pdfDoc.fontSize(16).text(owner.name, { align: 'center' });
    pdfDoc.fontSize(12).text(owner.address, { align: 'center' });
    pdfDoc.text(`Email: ${owner.email} | Phone: ${owner.phone} | Website: ${owner.website}`, { align: 'center' });
    pdfDoc.moveDown();
    
    pdfDoc.fontSize(18).text(`Invoice #${order.order_id}`, { align: 'center' });
    pdfDoc.moveDown();
    
    pdfDoc.fontSize(12).text(`Customer: ${order.user_name} (${order.user_email})`);
    pdfDoc.text(`Order Date: ${new Date(order.order_date).toLocaleDateString()}`);
    pdfDoc.text(`Status: ${order.status}`);
    pdfDoc.moveDown();
    
    pdfDoc.fontSize(12).text('Delivery Address:', { underline: true });
    pdfDoc.text(`${order.delivery_name}`);
    pdfDoc.text(`${order.delivery_street}`);
    pdfDoc.text(`${order.delivery_city}, ${order.delivery_state}, ${order.delivery_country} ${order.delivery_zip_code}`);
    pdfDoc.moveDown();

    pdfDoc.fontSize(12).text('Billing Address:', { underline: true });
    pdfDoc.text(`${order.billing_name}`);
    pdfDoc.text(`${order.billing_street}`);
    pdfDoc.text(`${order.billing_city}, ${order.billing_state}, ${order.billing_country} ${order.billing_zip_code}`);
    pdfDoc.moveDown();

    pdfDoc.fontSize(14).text('Order Items:', { underline: true });
    items.forEach(item => {
      const totalPrice = item.quantity * parseFloat(item.price);
      pdfDoc.text(`${item.article_name} - ${item.quantity} x $${parseFloat(item.price).toFixed(2)} = $${totalPrice.toFixed(2)}`);
    });
    pdfDoc.moveDown();
    
    pdfDoc.fontSize(14).text(`Total Amount: $${parseFloat(order.total_amount).toFixed(2)}`, { bold: true });
    pdfDoc.end();

  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// New route for delivery address label
app.get('/label/:orderId', async (req, res) => {
  const { orderId } = req.params;
  console.log(`Generating label for order ID: ${orderId}`);

  try {
    // Fetch order details
    const orderRows = await queryAsync(
      `SELECT o.*, 
              u.delivery_name, u.delivery_street, u.delivery_city, u.delivery_state, u.delivery_country, u.delivery_zip_code
       FROM orders o
       JOIN users u ON o.user_id = u.user_id
       WHERE o.order_id = ?`,
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderRows[0];

    // Set headers for inline PDF display
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="label_${orderId}.pdf"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Create PDF document and pipe directly to response
    const pdfDoc = new PDFDocument({ size: 'A6' }); // Smaller size for labels
    pdfDoc.pipe(res);

    // Add delivery address to PDF
    pdfDoc.fontSize(14).text('Delivery Address:', { underline: true });
    pdfDoc.fontSize(12).text(`${order.delivery_name}`);
    pdfDoc.text(`${order.delivery_street}`);
    pdfDoc.text(`${order.delivery_city}, ${order.delivery_state}, ${order.delivery_country} ${order.delivery_zip_code}`);
    pdfDoc.end();

  } catch (error) {
    console.error('Error generating label:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API Endpoint
app.get('/recommend', async (req, res) => {
  const category = req.query.category;
  if (!category) {
    console.error('❌ Category is missing in request!');
    return res.status(400).json({ error: 'Category is required' });
  }
  try {
    const recommendations = await recommendProducts({ category });
    res.json({ recommendations });
  } catch (error) {
    console.error('❌ Error fetching recommendations:', error);
    res.status(500).json({ error: 'Error while fetching recommendations' });
  }
});

// Comments Routes
app.get('/articles/:articleId/comments', async (req, res) => {
  const { articleId } = req.params;
  const { approvedOnly = 'true' } = req.query; // Default to showing only approved comments

  try {
    let query = `
      SELECT c.*, u.name as user_name 
      FROM article_comments c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.article_id = ? 
      AND c.deleted_at IS NULL
    `;
    
    const params = [articleId];
    
    if (approvedOnly === 'true') {
      query += ' AND c.is_approved = 1';
    }

    query += ' ORDER BY c.created_at DESC';

    const [comments] = await db.promise().query(query, params);
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.post('/articles/:articleId/comments', [
  check('comment_text').notEmpty().withMessage('Comment text is required'),
  check('user_id').isInt().withMessage('Valid user ID is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { articleId } = req.params;
  const { comment_text, rating, user_id } = req.body;

  try {
    const [result] = await db.promise().query(
      `INSERT INTO article_comments 
      (article_id, user_id, comment_text, rating, is_approved) 
      VALUES (?, ?, ?, ?, ?)`,
      [articleId, user_id, comment_text, rating || null, 0] // Default to pending approval
    );

    // Get the newly created comment with user details
    const [newComment] = await db.promise().query(`
      SELECT c.*, u.name as user_name 
      FROM article_comments c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.comment_id = ?
    `, [result.insertId]);

    res.status(201).json(newComment[0]);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Validation middleware
const validateCommentUpdate = (req, res, next) => {
  const { comment_text } = req.body;
  
  if (!comment_text || comment_text.trim() === '') {
    return res.status(400).json({ error: 'Comment text is required' });
  }
  
  if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  next();
};

// In your Express routes (server-side)
app.put('/articles/:articleId/comments/:commentId', async (req, res) => {
  const { articleId, commentId } = req.params;
  const { comment_text, rating } = req.body;

  try {
    const [result] = await db.promise().query(
      `UPDATE article_comments 
      SET comment_text = ?, rating = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE comment_id = ? AND article_id = ? AND deleted_at IS NULL`,
      [comment_text, rating || null, commentId, articleId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Return the updated comment
    const [updatedComment] = await db.promise().query(
      `SELECT * FROM article_comments WHERE comment_id = ?`,
      [commentId]
    );
    
    res.status(200).json(updatedComment[0]);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

app.patch('/articles/:articleId/comments/:commentId/approve', async (req, res) => {
  const { articleId, commentId } = req.params;
  const { approved } = req.body; // Should be boolean (true/false)

  try {
    await db.promise().query(
      `UPDATE article_comments 
      SET is_approved = ? 
      WHERE comment_id = ? AND article_id = ? AND deleted_at IS NULL`,
      [approved ? 1 : 0, commentId, articleId]
    );

    res.status(204).end();
  } catch (error) {
    console.error('Error approving comment:', error);
    res.status(500).json({ error: 'Failed to update comment status' });
  }
});

app.delete('/articles/:articleId/comments/:commentId', async (req, res) => {
  const { articleId, commentId } = req.params;

  try {
    // Soft delete the comment
    await db.promise().query(
      `UPDATE article_comments 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE comment_id = ? AND article_id = ? AND deleted_at IS NULL`,
      [commentId, articleId]
    );

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

app.get('/admin/comments/pending', async (req, res) => {
  try {
    const query = `
      SELECT c.*, u.name as user_name, a.name as article_name
      FROM article_comments c
      JOIN users u ON c.user_id = u.user_id
      JOIN article a ON c.article_id = a.article_id
      WHERE c.is_approved = 0 AND c.deleted_at IS NULL
      ORDER BY c.created_at DESC
    `;

    const [comments] = await db.promise().query(query);

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching pending comments:', error);
    res.status(500).json({ error: 'Failed to fetch pending comments' });
  }
});

// GET pending comments for a specific article
app.get('/admin/comments/pending/:article_id', async (req, res) => {
  const { article_id } = req.params;  // Extract article_id from the request parameters

  try {
    const query = `
      SELECT c.*, u.name as user_name, a.name as article_name
      FROM article_comments c
      JOIN users u ON c.user_id = u.user_id
      JOIN article a ON c.article_id = a.article_id
      WHERE c.is_approved = 0 AND c.article_id = ? AND c.deleted_at IS NULL
      ORDER BY c.created_at DESC
    `;

    const [comments] = await db.promise().query(query, [article_id]);

    if (comments.length === 0) {
      return res.status(404).json({ message: 'No pending comments found for this article' });
    }

    res.status(200).json(comments);  // Return the list of pending comments
  } catch (error) {
    console.error('Error fetching pending comments:', error);
    res.status(500).json({ error: 'Failed to fetch pending comments' });
  }
});