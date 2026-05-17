import React, { useState } from 'react';

const App = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop', price: 1200, userId: 'user1' },
    { id: 2, name: 'Phone', price: 800, userId: 'user2' }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: ''
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showMyProducts, setShowMyProducts] = useState(false);

  // Fake Login
  const handleLogin = (e) => {
    e.preventDefault();

    setUser({
      uid: 'user1',
      email: email
    });

    setEmail('');
    setPassword('');
  };

  // Fake Register
  const handleRegister = (e) => {
    e.preventDefault();

    alert('Registered Successfully!');

    setUser({
      uid: 'user1',
      email: email
    });

    setEmail('');
    setPassword('');
  };

  // Fake Google Login
  const handleGoogleSignIn = () => {
    setUser({
      uid: 'google-user',
      email: 'googleuser@gmail.com'
    });
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setEditingId(null);
    setFormData({
      name: '',
      price: ''
    });
    setShowMyProducts(false);
  };

  // Add / Update Product
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) return;

    if (editingId) {
      const updatedProducts = products.map((product) =>
        product.id === editingId
          ? {
              ...product,
              name: formData.name,
              price: formData.price
            }
          : product
      );

      setProducts(updatedProducts);
    } else {
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        price: formData.price,
        userId: user.uid
      };

      setProducts([...products, newProduct]);
    }

    resetForm();
  };

  // Edit Product
  const handleEdit = (product) => {
    if (product.userId !== user.uid) {
      alert('You can only edit your own products!');
      return;
    }

    setEditingId(product.id);

    setFormData({
      name: product.name,
      price: product.price
    });
  };

  // Delete Product
  const handleDelete = (id, productUserId) => {
    if (productUserId !== user.uid) {
      alert('You can only delete your own products!');
      return;
    }

    const confirmDelete = window.confirm('Delete product?');

    if (confirmDelete) {
      const filteredProducts = products.filter(
        (product) => product.id !== id
      );

      setProducts(filteredProducts);
    }
  };

  // Reset Form
  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: '',
      price: ''
    });
  };

  // Filter Products
  const displayedProducts = showMyProducts
    ? products.filter((product) => product.userId === user.uid)
    : products;

  // LOGIN / REGISTER SCREEN
  if (!user) {
    return (
      <div
        style={{
          padding: '20px',
          maxWidth: '400px',
          margin: '100px auto'
        }}
      >
        <h2 style={{ textAlign: 'center' }}>
          Product Management System App
        </h2>

        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            gap: '10px'
          }}
        >
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
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
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
                cursor: 'pointer'
              }}
            >
              Sign in with Google
            </button>
          </div>
        </form>

        <p
          style={{
            marginTop: '20px',
            fontSize: '12px',
            color: '#666',
            textAlign: 'center'
          }}
        >
          {isLogin
            ? "Don't have an account? "
            : 'Already have an account? '}

          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <h1>Product Management</h1>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}
        >
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
            style={{
              padding: '8px 16px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* PRODUCT FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}
      >
        <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>

        <input
          type="text"
          placeholder="Product Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value
            })
          }
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />

        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value
            })
          }
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />

        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {editingId ? 'Update' : 'Add'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '10px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* PRODUCTS LIST */}
      <div>
        <h2>
          {showMyProducts ? 'My Products' : 'All Products'} (
          {displayedProducts.length})
        </h2>

        {displayedProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '10px'
            }}
          >
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>
                    {product.name}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: '#28a745',
                      fontWeight: 'bold'
                    }}
                  >
                    ${product.price}
                  </p>

                  {!showMyProducts && (
                    <p
                      style={{
                        margin: '5px 0 0 0',
                        fontSize: '12px',
                        color: '#666'
                      }}
                    >
                      User ID: {product.userId}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      padding: '5px 15px',
                      marginRight: '5px',
                      background: '#ffc107',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(product.id, product.userId)
                    }
                    style={{
                      padding: '5px 15px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
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