const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
        res.status(200).json({ id, name, description });
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
    console.log(req.body)
    db.query('INSERT INTO category (department_id, name, description) VALUES (?, ?, ?)', [department_id, name, description], (error, results) => {
        if (error) return res.status(500).json({ error });
        console.log(results)
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
app.get('/articles', (req, res) => {
    db.query('SELECT * FROM article', (error, results) => {
        if (error) return res.status(500).json({ error });
        res.status(200).json(results);
    });
});

// Create a new article and link to a category
app.post('/articles', (req, res) => {
    const {
        name,
        description,
        image_1,
        image_2,
        promotion_at_homepage_level,
        promotion_at_department_level,
        category_ids, // Array of selected category IDs
    } = req.body;

    // Validate required fields
    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required.' });
    }

    // Insert the new article
    db.query(
        'INSERT INTO article (name, description, image_1, image_2, promotion_at_homepage_level, promotion_at_department_level) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, image_1, image_2, promotion_at_homepage_level, promotion_at_department_level],
        (insertErr, results) => {
            if (insertErr) {
                return res.status(500).json({ error: insertErr });
            }

            const articleId = results.insertId; // Get the new article ID

            // Prepare the values for inserting into category_article
            const categoryArticleValues = category_ids.map((category_id) => [category_id, articleId]);

            // Insert into category_article for each selected category
            db.query(
                'INSERT INTO category_article (category_id, article_id) VALUES ?',
                [categoryArticleValues],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    }
                    res.status(201).json({ id: articleId, name });
                }
            );
        }
    );
});




// Update an existing article
app.put('/articles/:id', (req, res) => {
    const { id } = req.params;
    const {
        name,
        description,
        image_1,
        image_2,
        promotion_at_homepage_level,
        promotion_at_department_level,
        category_ids // Multiple categories
    } = req.body;

    db.query(
        'UPDATE article SET name = ?, description = ?, image_1 = ?, image_2 = ?, promotion_at_homepage_level = ?, promotion_at_department_level = ? WHERE article_id = ?',
        [name, description, image_1, image_2, promotion_at_homepage_level, promotion_at_department_level, id],
        (error, results) => {
            if (error) return res.status(500).json({ error });

            // Delete existing category relations
            db.query('DELETE FROM category_article WHERE article_id = ?', [id], (err) => {
                if (err) return res.status(500).json({ error: err });

                // Insert the updated categories
                const categoryArticleValues = category_ids.map((category_id) => [category_id, id]);
                db.query(
                    'INSERT INTO category_article (category_id, article_id) VALUES ?',
                    [categoryArticleValues],
                    (insertErr) => {
                        if (insertErr) return res.status(500).json({ error: insertErr });

                        res.status(200).json({ id, name, description, image_1, image_2, promotion_at_homepage_level, promotion_at_department_level, category_ids });
                    }
                );
            });
        }
    );
});

// Delete an article
app.delete('/articles/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM article WHERE article_id = ?', [id], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.status(204).end();
    });
});