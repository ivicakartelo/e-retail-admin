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
    db.query('DELETE FROM department WHERE department_id = ?', [id], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.status(204).end();
    });
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
    db.query('DELETE FROM category WHERE category_id = ?', [id], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.status(204).end();
    });
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
      check('category_ids').isString().withMessage('Category IDs must be a JSON string.'),
  ],
  (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, promotion_at_homepage_level = 0, promotion_at_department_level = 0 } = req.body;
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

          // Insert the article
          const insertArticleQuery = `
              INSERT INTO article 
              (name, description, image_1, image_2, promotion_at_homepage_level, promotion_at_department_level)
              VALUES (?, ?, ?, ?, ?, ?)
          `;

          db.query(
              insertArticleQuery,
              [name, description, image_1, image_2, promotion_at_homepage_level, promotion_at_department_level],
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

// Update an existing article and its categories
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
            promotion_at_homepage_level,
            promotion_at_department_level,
        } = req.body;

        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required.' });
        }

        const image_1 = req.files?.image_1?.[0]?.filename || null;
        const image_2 = req.files?.image_2?.[0]?.filename || null;

        const updateQuery = `
            UPDATE article 
            SET name = ?, description = ?, 
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

// Delete an article
app.delete('/articles/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM article WHERE article_id = ?', [id], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.status(204).end();
    });
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