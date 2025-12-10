<button
              onDoubleClick={() => setShowAdminLogin(true)}
              style={{
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                color: '#999',
                background: '#f5f5f5',
                transition: 'all 0.3s',
                marginTop: '10px'
              }}
              title="Haz doble clic para acceso admin"
            >
              RestauApp v1.0
            </button>import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, set, onValue, remove, update } from 'firebase/database';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState(Array.from({ length: 12 }, (_, i) => ({ id: i + 1, occupied: false })));
  const [loading, setLoading] = useState(true);
  
  const ADMIN_PASSWORD = 'admin123';
  
  const menu = [
    { id: 1, name: 'Hamburguesa Premium', price: 18000, category: 'Platos Principales', image: 'https://via.placeholder.com/150?text=Hamburguesa' },
    { id: 2, name: 'Pechuga a la Parrilla', price: 22000, category: 'Platos Principales', image: 'https://via.placeholder.com/150?text=Pechuga' },
    { id: 3, name: 'Pasta Carbonara', price: 16000, category: 'Platos Principales', image: 'https://via.placeholder.com/150?text=Pasta' },
    { id: 4, name: 'Ensalada César', price: 12000, category: 'Ensaladas', image: 'https://via.placeholder.com/150?text=Ensalada' },
    { id: 5, name: 'Sopa del Día', price: 8000, category: 'Sopas', image: 'https://via.placeholder.com/150?text=Sopa' },
    { id: 6, name: 'Papas Fritas', price: 6000, category: 'Acompañamientos', image: 'https://via.placeholder.com/150?text=Papas' },
    { id: 7, name: 'Coca-Cola', price: 3000, category: 'Bebidas', image: 'https://via.placeholder.com/150?text=Coca-Cola' },
    { id: 8, name: 'Cerveza Artesanal', price: 7000, category: 'Bebidas', image: 'https://via.placeholder.com/150?text=Cerveza' },
    { id: 9, name: 'Postre Chocolate', price: 9000, category: 'Postres', image: 'https://via.placeholder.com/150?text=Postre' },
  ];

  const categories = [...new Set(menu.map(m => m.category))];

  // Sincronizar órdenes desde Firebase
  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList = Object.keys(data).map(key => ({
          id: parseInt(key),
          ...data[key]
        }));
        setOrders(ordersList);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sincronizar mesas desde Firebase
  useEffect(() => {
    const tablesRef = ref(db, 'tables');
    const unsubscribe = onValue(tablesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tablesList = Object.keys(data).map(key => ({
          id: parseInt(key),
          ...data[key]
        }));
        setTables(tablesList);
      }
    });
    return () => unsubscribe();
  }, []);

  // Inicializar tablas si no existen
  useEffect(() => {
    const tablesRef = ref(db, 'tables');
    onValue(tablesRef, (snapshot) => {
      if (!snapshot.exists()) {
        const initialTables = {};
        for (let i = 1; i <= 12; i++) {
          initialTables[i] = { id: i, occupied: false };
        }
        set(tablesRef, initialTables);
      }
    }, { onlyOnce: true });
  }, []);

  const AdminLogin = () => {
    const handleLogin = () => {
      if (adminPassword === ADMIN_PASSWORD) {
        setAdminAuthenticated(true);
        setAdminPassword('');
      } else {
        alert('Contraseña incorrecta');
        setAdminPassword('');
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleLogin();
      }
    };

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '50px 40px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', maxWidth: '400px', width: '100%' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#1e3c72', fontWeight: 'bold', textAlign: 'center' }}>Acceso Administrador</h1>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '0.95rem', textAlign: 'center' }}>Ingresa tu contraseña para continuar</p>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '0.95rem' }}>Contraseña</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ingresa tu contraseña"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              autoFocus
            />
          </div>
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Ingresar
          </button>

          <button
            onClick={() => setUserRole(null)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#f5f5f5',
              color: '#666',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              marginTop: '15px',
              transition: 'all 0.3s'
            }}
          >
            Volver
          </button>
        </div>
      </div>
    );
  };

  const MesseroView = () => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);

    const addToCart = (item) => {
      const exists = cart.find(c => c.id === item.id);
      if (exists) {
        setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      } else {
        setCart([...cart, { ...item, qty: 1 }]);
      }
    };

    const updateQty = (id, qty) => {
      if (qty <= 0) {
        setCart(cart.filter(c => c.id !== id));
      } else {
        setCart(cart.map(c => c.id === id ? { ...c, qty } : c));
      }
    };

    const submitOrder = () => {
      if (!selectedTable || cart.length === 0) {
        alert('Selecciona mesa y agrega items');
        return;
      }
      const orderId = Date.now();
      const newOrder = {
        tableId: selectedTable,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        status: 'pendiente',
        time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      };
      
      set(ref(db, `orders/${orderId}`), newOrder);
      update(ref(db, `tables/${selectedTable}`), { occupied: true });
      
      setCart([]);
      setShowCart(false);
      setSelectedTable(null);
      alert('Pedido registrado correctamente');
    };

    const markAsDelivered = (orderId) => {
      const order = orders.find(o => o.id === orderId);
      update(ref(db, `orders/${orderId}`), { status: 'entregado' });
      update(ref(db, `tables/${order.tableId}`), { occupied: false });
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const readyOrders = orders.filter(o => o.status === 'listo');

    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 15px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: '20px 0 30px', textAlign: 'center', fontWeight: 'bold', color: '#2196F3' }}>
          Sistema de Pedidos - Mesero
        </h1>

        {readyOrders.length > 0 && (
          <div style={{ marginBottom: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px', borderLeft: '4px solid #ffc107' }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: '700', color: '#856404', fontSize: '1.1rem' }}>
              Pedidos Listos para Servir ({readyOrders.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {readyOrders.map(order => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'white', borderRadius: '6px', gap: '10px' }}>
                  <div>
                    <p style={{ margin: '0', fontWeight: '700', color: '#333', fontSize: '1rem' }}>Mesa {order.tableId}</p>
                    <p style={{ margin: '3px 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                      {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => markAsDelivered(order.id)}
                    style={{
                      background: '#4CAF50',
                      color: 'white',
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Entregado
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#333', fontWeight: '600' }}>Selecciona Mesa</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {tables.map(table => (
              <div key={table.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <button
                  onClick={() => setSelectedTable(table.id)}
                  disabled={table.occupied && selectedTable !== table.id}
                  style={{
                    padding: '15px',
                    border: selectedTable === table.id ? '2px solid #2196F3' : '2px solid #ddd',
                    background: selectedTable === table.id ? '#2196F3' : table.occupied ? '#ffebee' : 'white',
                    color: selectedTable === table.id ? 'white' : table.occupied ? '#c62828' : '#333',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: table.occupied && selectedTable !== table.id ? 'not-allowed' : 'pointer',
                    opacity: table.occupied && selectedTable !== table.id ? '0.5' : '1',
                    transition: 'all 0.3s'
                  }}
                  title={table.occupied ? 'Mesa ocupada' : 'Mesa disponible'}
                >
                  {table.id}
                </button>
                <button
                  onClick={() => {
                    update(ref(db, `tables/${table.id}`), { occupied: !table.occupied });
                  }}
                  style={{
                    padding: '6px',
                    background: table.occupied ? '#f44336' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {table.occupied ? 'Ocupada' : 'Libre'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 5px' }}>
          {categories.map(cat => (
            <div key={cat} style={{ background: 'white', padding: '20px', marginBottom: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#333', fontWeight: '600', borderBottom: '2px solid #2196F3', paddingBottom: '10px' }}>
                {cat}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
                {menu.filter(m => m.category === cat).map(item => (
                  <button
                    key={item.id}
                    onClick={() => addToCart(item)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      background: 'white',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      textAlign: 'center',
                      minHeight: '180px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2196F3';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        marginBottom: '8px'
                      }}
                    />
                    <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2196F3' }}>
                      ${item.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <button
            onClick={() => setShowCart(!showCart)}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              transition: 'all 0.3s',
              zIndex: 50
            }}
          >
            {cart.length}
          </button>
        )}

        {showCart && cart.length > 0 && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'flex-end',
              zIndex: 1000
            }}
            onClick={() => setShowCart(false)}
          >
            <div 
              style={{
                background: 'white',
                width: '100%',
                borderRadius: '20px 20px 0 0',
                padding: '25px 20px',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>Carrito - Mesa {selectedTable}</h2>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: '600', flex: 1, color: '#333' }}>{item.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      style={{ background: '#f44336', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      −
                    </button>
                    <span style={{ width: '35px', textAlign: 'center', fontWeight: 'bold' }}>{item.qty}</span>
                    <button 
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      style={{ background: '#4CAF50', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                    <span style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold', color: '#2196F3' }}>${(item.price * item.qty).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <div style={{ margin: '20px 0', padding: '15px', background: '#f0f0f0', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>
                Total: ${cartTotal.toLocaleString()}
              </div>
              <button
                onClick={submitOrder}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  marginTop: '15px'
                }}
              >
                Enviar a Cocina
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const KitchenView = () => {
    const updateOrderStatus = (orderId, status) => {
      update(ref(db, `orders/${orderId}`), { status });
    };

    const pendingOrders = orders.filter(o => o.status !== 'entregado');

    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 15px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: '20px 0 30px', textAlign: 'center', fontWeight: 'bold', color: '#f44336' }}>
          Panel de Cocina
        </h1>
        {pendingOrders.length === 0 ? (
          <div style={{ background: 'white', padding: '60px 20px', borderRadius: '12px', textAlign: 'center', color: '#999', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            No hay pedidos pendientes
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {pendingOrders.map(order => (
              <div
                key={order.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderLeft: '5px solid',
                  borderLeftColor: order.status === 'pendiente' ? '#ffc107' : order.status === 'preparando' ? '#2196F3' : '#4CAF50',
                  backgroundColor: order.status === 'pendiente' ? '#fffef0' : order.status === 'preparando' ? '#f0f7ff' : '#f1f8f4',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#333', fontWeight: 'bold' }}>Mesa {order.tableId}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#999' }}>{order.time}</span>
                </div>
                <ul style={{ listStyle: 'none', marginBottom: '15px' }}>
                  {order.items.map(item => (
                    <li key={item.id} style={{ padding: '8px 0', color: '#555', fontSize: '0.95rem', borderBottom: '1px dotted #eee' }}>
                      {item.qty}x {item.name}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {order.status === 'pendiente' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparando')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s'
                      }}
                    >
                      Preparando
                    </button>
                  )}
                  {order.status === 'preparando' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'listo')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s'
                      }}
                    >
                      Listo
                    </button>
                  )}
                  {order.status === 'listo' && (
                    <div style={{ flex: 1, padding: '10px', background: '#4CAF50', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'not-allowed', fontSize: '0.9rem', textAlign: 'center' }}>
                      Listo - Mesero a Servir
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const AdminView = () => {
    const dailySales = orders
      .filter(o => o.status === 'entregado')
      .reduce((sum, o) => sum + o.total, 0);
    
    const completedOrders = orders.filter(o => o.status === 'entregado').length;
    const totalOrders = orders.length;

    // Agrupar pedidos por día
    const ordersByDay = {};
    orders.forEach(order => {
      const date = new Date(order.id);
      const dateStr = date.toLocaleDateString('es-CO');
      if (!ordersByDay[dateStr]) {
        ordersByDay[dateStr] = [];
      }
      ordersByDay[dateStr].push(order);
    });

    // Calcular ganancias por día
    const dailyStats = Object.keys(ordersByDay).map(day => {
      const dayOrders = ordersByDay[day];
      const dayCompleted = dayOrders.filter(o => o.status === 'entregado');
      const dayTotal = dayCompleted.reduce((sum, o) => sum + o.total, 0);
      return {
        day,
        total: dayTotal,
        orders: dayCompleted.length,
        allOrders: dayOrders.length
      };
    }).sort((a, b) => new Date(b.day) - new Date(a.day));

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: '20px 0 30px', textAlign: 'center', fontWeight: 'bold', color: '#1e3c72' }}>
          Panel de Ventas
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '5px solid #4CAF50', transition: 'all 0.3s' }}>
            <div style={{ fontSize: '2.5rem' }}>$</div>
            <div>
              <p style={{ color: '#999', fontSize: '0.95rem', marginBottom: '5px', fontWeight: '600' }}>Ventas Hoy</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>${dailySales.toLocaleString()}</p>
            </div>
          </div>
          
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '5px solid #2196F3', transition: 'all 0.3s' }}>
            <div style={{ fontSize: '2.5rem' }}>∑</div>
            <div>
              <p style={{ color: '#999', fontSize: '0.95rem', marginBottom: '5px', fontWeight: '600' }}>Total Pedidos</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>{totalOrders}</p>
            </div>
          </div>
          
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '5px solid #9C27B0', transition: 'all 0.3s' }}>
            <div style={{ fontSize: '2.5rem' }}>✓</div>
            <div>
              <p style={{ color: '#999', fontSize: '0.95rem', marginBottom: '5px', fontWeight: '600' }}>Pedidos Completados</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>{completedOrders}</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 20px 0', color: '#333', borderBottom: '2px solid #1e3c72', paddingBottom: '10px' }}>Ganancias por Día</h2>
          
          {dailyStats.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '30px' }}>Sin pedidos completados</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Fecha</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Pedidos Completados</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Total Pedidos</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#333' }}>Ganancias</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyStats.map((stat, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee', background: idx % 2 === 0 ? 'white' : '#f9f9f9' }}>
                      <td style={{ padding: '12px', color: '#333', fontWeight: '600' }}>{stat.day}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>{stat.orders}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>{stat.allOrders}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#4CAF50', fontSize: '1.1rem' }}>${stat.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '30px 0 15px', color: '#333' }}>Historial Detallado de Pedidos</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '600px', overflowY: 'auto' }}>
          {orders.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '20px', fontSize: '0.9rem' }}>No hay pedidos registrados</p>
          ) : (
            orders.map(order => (
              <div 
                key={order.id} 
                style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  borderLeft: '4px solid',
                  borderLeftColor: order.status === 'pendiente' ? '#ffc107' : order.status === 'preparando' ? '#2196F3' : order.status === 'listo' ? '#4CAF50' : '#9C27B0',
                  backgroundColor: order.status === 'pendiente' ? '#fffef0' : order.status === 'preparando' ? '#f0f7ff' : order.status === 'listo' ? '#f1f8f4' : '#f9f5ff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>Mesa {order.tableId} - {order.items.length} items</span>
                  <span style={{ fontSize: '0.85rem', color: '#999' }}>{order.time}</span>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '600' }}>Monto: ${order.total.toLocaleString()}</p>
                <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.1)', color: '#333' }}>
                  {order.status.toUpperCase()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Cargando datos...</p>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '50px 40px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', maxWidth: '400px', width: '100%' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#1e3c72', fontWeight: 'bold', textAlign: 'center' }}>RestauApp</h1>
          <p style={{ color: '#666', marginBottom: '40px', fontSize: '1rem', textAlign: 'center', fontWeight: '500' }}>Sistema de Gestión de Pedidos</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => setUserRole('mesero')}
              style={{
                padding: '15px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: 'white',
                background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                transition: 'all 0.3s'
              }}
            >
              Mesero
            </button>
            <button
              onClick={() => setUserRole('cocina')}
              style={{
                padding: '15px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: 'white',
                background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                transition: 'all 0.3s'
              }}
            >
              Cocina
            </button>

          </div>
        </div>
      </div>
    );
  }

  if (showAdminLogin && !adminAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '50px 40px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', maxWidth: '400px', width: '100%' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#1e3c72', fontWeight: 'bold', textAlign: 'center' }}>Acceso Administrador</h1>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '0.95rem', textAlign: 'center' }}>Ingresa tu contraseña para continuar</p>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '0.95rem' }}>Contraseña</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (adminPassword === ADMIN_PASSWORD) {
                    setAdminAuthenticated(true);
                    setUserRole('admin');
                    setAdminPassword('');
                  } else {
                    alert('Contraseña incorrecta');
                    setAdminPassword('');
                  }
                }
              }}
              placeholder="Ingresa tu contraseña"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              autoFocus
            />
          </div>
          <button
            onClick={() => {
              if (adminPassword === ADMIN_PASSWORD) {
                setAdminAuthenticated(true);
                setUserRole('admin');
                setAdminPassword('');
              } else {
                alert('Contraseña incorrecta');
                setAdminPassword('');
              }
            }}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Ingresar
          </button>

          <button
            onClick={() => {
              setShowAdminLogin(false);
              setAdminPassword('');
            }}
            style={{
              width: '100%',
              padding: '12px',
              background: '#f5f5f5',
              color: '#666',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              marginTop: '15px',
              transition: 'all 0.3s'
            }}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (userRole === 'admin' && !adminAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
      <header style={{ background: 'white', padding: '15px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <button
          onClick={() => {
            setUserRole(null);
            setAdminAuthenticated(false);
          }}
          style={{
            background: '#666',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontSize: '0.95rem'
          }}
        >
          Salir
        </button>
      </header>
      <main style={{ flex: 1, paddingBottom: '20px' }}>
        {userRole === 'mesero' && <MesseroView />}
        {userRole === 'cocina' && <KitchenView />}
        {userRole === 'admin' && adminAuthenticated && <AdminView />}
      </main>
    </div>
  );
}

export default App;