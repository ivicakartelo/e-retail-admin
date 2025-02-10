const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { validationResult, check } = require('express-validator'); // Fix: Import validation utilities
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/assets/images', express.static(path.join(__dirname, 'public/assets/images')));

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
        res.status(201).json({ department_id: results.insertId, name, description });
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
          res.status(201).json({ user_id: results.insertId, name, email, role, delivery_address, billing_address });
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