const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const db = mysql.createConnection(process.env.DATABASE_URL || {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zenzo_store'
});

db.connect((err) => {
    if (err) throw err;
    console.log('🔥 Zenzo Store database nyambung!');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use(session({
    secret: 'zenzorahasia',
    resave: false,
    saveUninitialized: true
}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.get('/', (req, res) => {
    db.query('SELECT * FROM products', (err, products) => {
        if (err) throw err;
        res.render('index', { products });
    });
});

app.get('/checkout/:id', (req, res) => {
    db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
        if (err) throw err;
        res.render('checkout', { product: product[0] });
    });
});

app.post('/process-checkout', (req, res) => {
    const { customer_name, customer_phone, customer_address, product_id, quantity, total_price, payment_method } = req.body;
    
    db.query(`INSERT INTO transactions (customer_name, customer_phone, customer_address, product_id, quantity, total_price, payment_method) VALUES (?,?,?,?,?,?,?)`,
        [customer_name, customer_phone, customer_address, product_id, quantity, total_price, payment_method],
        (err, result) => {
            if (err) throw err;
            let paymentNumber = '';
            if (payment_method === 'QRIS') paymentNumber = 'QRIS: 0895323247676';
            else if (payment_method === 'DANA') paymentNumber = 'DANA: 0895323247676';
            else paymentNumber = 'GOPAY: 0895323247676';
            res.render('payment-info', { total_price, payment_method, payment_number: paymentNumber });
        });
});

app.get('/admin/login', (req, res) => res.render('admin/login'));
app.post('/admin/login', (req, res) => {
    db.query('SELECT * FROM admin WHERE username = ? AND password = MD5(?)', [req.body.username, req.body.password], (err, result) => {
        if (result.length > 0) {
            req.session.admin = true;
            res.redirect('/admin/dashboard');
        } else res.send('Login gagal! <a href="/admin/login">Coba lagi</a>');
    });
});

const isAdmin = (req, res, next) => req.session.admin ? next() : res.redirect('/admin/login');

app.get('/admin/dashboard', isAdmin, (req, res) => {
    db.query('SELECT * FROM products', (err, products) => {
        db.query('SELECT * FROM transactions ORDER BY id DESC', (err2, transactions) => {
            res.render('admin/dashboard', { products, transactions });
        });
    });
});

app.get('/admin/products', isAdmin, (req, res) => {
    db.query('SELECT * FROM products', (err, products) => res.render('admin/products', { products }));
});

app.post('/admin/product/add', isAdmin, upload.single('image'), (req, res) => {
    db.query('INSERT INTO products (name, price, stock, image) VALUES (?,?,?,?)', 
        [req.body.name, req.body.price, req.body.stock, req.file.filename], () => res.redirect('/admin/products'));
});

app.get('/admin/product/edit/:id', isAdmin, (req, res) => {
    db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
        res.render('admin/edit-product', { product: product[0] });
    });
});

app.post('/admin/product/update/:id', isAdmin, upload.single('image'), (req, res) => {
    if (req.file) {
        db.query('UPDATE products SET name=?, price=?, stock=?, image=? WHERE id=?', 
            [req.body.name, req.body.price, req.body.stock, req.file.filename, req.params.id], () => res.redirect('/admin/products'));
    } else {
        db.query('UPDATE products SET name=?, price=?, stock=? WHERE id=?', 
            [req.body.name, req.body.price, req.body.stock, req.params.id], () => res.redirect('/admin/products'));
    }
});

app.get('/admin/product/delete/:id', isAdmin, (req, res) => {
    db.query('DELETE FROM products WHERE id=?', [req.params.id], () => res.redirect('/admin/products'));
});

app.post('/admin/transaction/update', isAdmin, (req, res) => {
    db.query('UPDATE transactions SET status=? WHERE id=?', [req.body.status, req.body.id], () => res.redirect('/admin/dashboard'));
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

app.listen(port, () => {
    console.log(`🖤 Zenzo Store running at http://localhost:${port}`);
});
