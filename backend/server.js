const express = require("express");
const bcrypt = require("bcrypt");
const sqlite = require("sqlite3").verbose();
const session = require("express-session");
const app = express();

const PORT = 3000;

app.use(express.json());

// Connects to the sqlite database
const db = new sqlite.Database("./user.db", (err) => {
    if(err)
        console.log("Connection to database failed: " + err.message);
    else
        console.log("Connection to Database Success");
});


// Creates the table if its not already created
db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            address TEXT NOT NULL,
            country TEXT NOT NULL,
            state TEXT NOT NULL,
            zip TEXT NOT NULL
        )   
`);

// Sets up the session for cookies
app.use(session({
  secret: "3f9xA!kL92#pQz8$wE@vR7tY&uI0oP",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false // true ONLY if using HTTPS
  }
}));

// GET method for the admin dashboard, shows all the users
app.get("/api/users", async (req, res) => {
    console.log("GET /api/users");
    db.all("SELECT id, email, address, country, state, zip FROM users", [], (err, rows) => {
        if(err){
            return res.json({success:false, message: err});
        }

        res.json({success: true, users: rows});
    });
});

// GET method for the dashboard grabs the session of that user, and sends the a user object with all of its attributes 
app.get("/api/dashboard", async (req, res) => {
    console.log("GET /api/dashboard");

    if(req.session.userId){
        res.json({
            success: true,
            loggedIn: true,
            user :{
                userId: req.session.userId,
                email: req.session.email,
                password: "HIDDEN",
                address: req.session.address,
                country: req.session.country,
                state: req.session.state,
                zip: req.session.zip
            }
        });
    } else{
        res.json({ loggedIn: false });
    }
});

// POST method to log out, destroys the session and clears the cookies
app.post("/api/logout", async (req, res) => {
    console.log("POST /api/logout");
    req.session.destroy((err) => {
        if(err){
            return res.json({success:false});
        }

        res.clearCookie("connect.sid");
        res.json({success:true});
    });
});

// POST method for logging in, runs a sql command to grab all users 
// to check if any email matchs grabs the that one user into an object,
//  and checks for email password and adds it to the session(cookies)
app.post("/api/login", async (req, res) => {
    console.log("POST /api/login");
    console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {

        if(err){
            return res.json({ success:false });
        }

        if(!user){
            return res.json({ success:false, message: "Invalid email or password"});
        }
        const match = await bcrypt.compare(password, user.password);

        if(!match){
            return res.json({ success:false, message: "Invalid email or password" });
        }

        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.address = user.address;
        req.session.country = user.country;
        req.session.state = user.state;
        req.session.zip = user.zip;
       
        res.json({ success: true });
    });
});

// POST for signing up, inserts the users information into the database, hashes the password
app.post("/api/signup", async (req, res) => {
    console.log("POST /api/signup");
    console.log(req.body);
    const { email, password, address, country, state, zip } = req.body;

    const insertSQL = `INSERT INTO users (email, password, address, country, state, zip) VALUES (?,?,?,?,?,?)`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [email, hashedPassword, address, country, state, zip];
    

    try {
        db.run(insertSQL, values, function (err) {
            if(err === "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email") {
                return res.json({ success: false, message: "Account already exists" });
            }
            if(err){
                return res.json({ success: false, message: err.message });
            }

            
            res.json({success: true});
        });
    } catch(err){
        console.log(err);
        res.json({ success: false, message: "Server error" });
    }
    

})

//Shows the app is running
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
