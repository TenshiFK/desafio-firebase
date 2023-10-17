const express = require('express');
const { getApps, initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require("firebase/firestore");
const { updateDoc, setDoc, doc } = require("firebase/firestore");
const { deleteDoc } = require("firebase/firestore");
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { signOut } = require('firebase/auth');
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var firebaseConfig = {
    apiKey: "AIzaSyAgC5BxpVAbZNFOvE6bFzbySNN9A71KJxc",
    authDomain: "autenticacao-278eb.firebaseapp.com",
    projectId: "autenticacao-278eb",
    storageBucket: "autenticacao-278eb.appspot.com",
    messagingSenderId: "899221836207",
    appId: "1:899221836207:web:0d1138fba969b1e9dd1f5a"
};

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

//rota login
app.post('/login', async (req, res) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
        console.log(userCredential); // Adicione esta linha
        res.redirect('/home');
    } catch (error) {
        res.send(error.message);
    }
});

//rota logout
app.post('/logout', async (req, res) => {
    try {
        await signOut(auth);
        res.redirect('/');
    } catch (error) {
        res.send(error.message);
    }
});

//rota add post
app.get('/add', (req,res) => {
    res.render('add');
});

//rota add 
app.post('/add', async(req, res) => {
    try{
        const { nameMusica, nameCantor, opiniao } = req.body;
        const opinioesMusicasRef = collection(db, "opinioesMusicas");
        await addDoc(opinioesMusicasRef, {
            "nameMusica": nameMusica,
            "nameCantor": nameCantor,
            "opiniao": opiniao,
        });
        res.redirect('/home');
    }
    catch (error) {
        res.send(error.message);
    }
});

//rota visualizar
app.get('/home', async(req, res) => {
    const user = auth.currentUser;
    console.log(user); // Adicione esta linha
    if (user) {
        try{
            const opMusicas = [];
            const snapshot = await getDocs(collection(db, 'opinioesMusicas'));
            snapshot.forEach((doc) => {
                let id = doc.id;
                let data = doc.data();
                opMusicas.push({id, ...data });
            });
            res.render('home', {user: user, opMusicas: opMusicas});
        }
        catch (error) {
            res.send(error.message);
        }
    } else {
        res.redirect('/');
    }
});

//rota update
app.get('/update/:id', (req, res) => {
    res.render('update', { id: req.params.id });
});

app.post('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nameMusica, nameCantor, opiniao } = req.body;
        const userRef = doc(db, "opinioesMusicas", id);
        await updateDoc(userRef, {
            "nameMusica": nameMusica,
            "nameCantor": nameCantor,
            "opiniao": opiniao,
        });
        res.redirect('/home');
    } catch (error) {
        res.send(error.message);
    }
});

//rota delete
app.post('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userRef = doc(db, "opinioesMusicas", id);
        await deleteDoc(userRef);
        res.redirect('/home');
    } catch (error) {
        res.send(error.message);
    }
});



app.listen(3000, () => console.log('Server started on port 3000'));

