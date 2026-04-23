import React, { useState, useEffect } from 'react';
import { db, auth, googleProvider } from './firebase';
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc,
  query, where, serverTimestamp, setDoc,
  getDoc
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth';

const App = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showMyProducts, setShowMyProducts] = useState(false);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) fetchProducts(showMyProducts);
      else setProducts([]);
    });
    return () => unsubscribe();
  }, []);

  // Refetch when filter changes
  useEffect(() => {
    if (user) {
      fetchProducts(showMyProducts);
    }
  }, [showMyProducts]);

  // Fetch products
  const fetchProducts = async (filterByUser = false) => {
    let querySnapshot;
    if (filterByUser && user) {
      const q = query(collection(db, 'products'), where('userId', '==', user.uid));
      querySnapshot = await getDocs(q);
    } else {
      querySnapshot = await getDocs(collection(db, 'products'));
    }
    const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsData);
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        role: 'user'
      });

      alert('Registration successful!');
      setEmail('');
      setPassword('');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      alert('Login failed: ' + error.message);
      // console.log(error.code)
      //    if (error.code === 'auth/user-not-found') {
      //   alert('User not found! Please register first before logging in.');
      // } else if (error.code === 'auth/wrong-password') {
      //   alert('Incorrect password. Please try again.');
      // } else if (error.code === 'auth/invalid-email') {
      //   alert('Invalid email format. Please enter a valid email.');
      // } else if (error.code === 'auth/too-many-requests') {
      //   alert('Too many failed attempts. Please try again later.');
      // } else {
      //   alert('Login failed. Please check your credentials.');
      // }
    }
  };

  // google login
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore, if not create
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          role: 'user',
          provider: 'google'
        });
      }

      alert('Google Sign-In successful!');
    } catch (error) {
      alert('Google Sign-In failed: ' + error.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setEditingId(null);
    setFormData({ name: '', price: '' });
    setShowMyProducts(false);
  };

  // CRUD Operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login first');
    if (!formData.name || !formData.price) return;

    if (editingId) {
      const productRef = doc(db, 'products', editingId);
      await updateDoc(productRef, {
        name: formData.name,
        price: formData.price,
        updatedAt: serverTimestamp()
      });
    } else {
      await addDoc(collection(db, 'products'), {
        name: formData.name,
        price: formData.price,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
    }

    resetForm();
    fetchProducts(showMyProducts);
  };

  const handleEdit = (product) => {
    // Check if product belongs to current user
    if (product.userId !== user.uid) {
      alert('You can only edit your own products!');
      return;
    }
    setEditingId(product.id);
    setFormData({ name: product.name, price: product.price });
  };

  const handleDelete = async (id, productUserId) => {
    if (!user) return;
    console.log(user.uid)
    console.log(productUserId)

    // Check if product belongs to current user
    if (productUserId !== user.uid) {
      alert('You can only delete your own products!');
      return;
    }

    if (window.confirm('Delete product?')) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts(showMyProducts);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', price: '' });
  };

  // Login/Register Screen
  if (!user) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '100px auto' }}>
        <h2 style={{ textAlign: 'center' }}>Product Management System</h2>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '10px',
              background: isLogin ? '#007bff' : '#f0f0f0',
              color: isLogin ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '10px',
              background: !isLogin ? '#28a745' : '#f0f0f0',
              color: !isLogin ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              background: isLogin ? '#007bff' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>

          <div style={{ marginTop: '15px' }}>
            <hr style={{ margin: '20px 0' }} />
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                padding: '10px',
                background: '#db4437',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </div>
        </form>

        <p style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    );
  }
  // console.log(products)
  // Products Dashboard (Logged In)
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Product Management</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setShowMyProducts(!showMyProducts)}
            style={{
              padding: '8px 16px',
              background: showMyProducts ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showMyProducts ? 'All Products' : 'My Products'}
          </button>
          <span>Welcome, {user.email}</span>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>

        <input
          type="text"
          placeholder="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          required
        />

        <div>
          <button
            type="submit"
            style={{ padding: '10px 20px', marginRight: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Products List */}
      <div>
        <h2>{showMyProducts ? 'My Products' : 'All Products'} ({products.length})</h2>
        {products.length === 0 ? (
          <p>No products found. Add your first product!</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {products.map(product => (
              <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{product.name}</h3>
                  <p style={{ margin: 0, color: '#28a745', fontWeight: 'bold' }}>${product.price}</p>
                  {!showMyProducts && product.userId && (
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                      User ID: {product.userId.slice(0, 8)}...
                    </p>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{ padding: '5px 15px', marginRight: '5px', background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.userId)}
                    style={{ padding: '5px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;