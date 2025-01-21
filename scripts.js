window.onload = function () {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      // If user is logged in, show the dashboard
      showDashboard();
    } else {
      // Otherwise, show the login page
      document.getElementById('login-page').classList.add('active');
      document.getElementById('dashboard').classList.remove('active');
    }
  };
  
  function signUp() {
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();
  
    if (username && password) {
      let users = JSON.parse(localStorage.getItem('users')) || {};
  
      if (users[username]) {
        alert('User already exists! Please log in.');
      } else {
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', username); // Auto-login after sign-up
        alert('Sign up successful!');
        showDashboard();
      }
    } else {
      alert('Please fill out all fields.');
    }
  }
  
  function logIn() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      showDashboard();
    } else {
      alert('Please sign up first!');
    }
  }
  
  function logOut() {
    localStorage.removeItem('currentUser');
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('login-page').classList.add('active');
  }
  
  function showDashboard() {
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');
    fetchDataAndRenderCharts();
  }
  
  function fetchDataAndRenderCharts() {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => {
        renderLineChart(data);
        renderSalesChart(data);
        updateSalesReport(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  

  function renderLineChart(data) {
    const labels = data.map(item => item.title);
    const prices = data.map(item => item.price);

    const ctx = document.getElementById('line-chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Product Prices',
          data: prices,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Real-Time Product Prices'
          }
        }
      }
    });
  }

  function renderSalesChart(data) {
    const categories = [...new Set(data.map(item => item.category))];
    const categorySales = categories.map(category =>
      data.filter(item => item.category === category)
        .reduce((sum, item) => sum + item.price, 0)
    );

    const ctx = document.getElementById('sales-chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Total Sales by Category',
          data: categorySales,
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Total Sales by Category'
          }
        }
      }
    });
  }

  function updateSalesReport(data) {
    const totalProducts = data.length;
    const avgPrice = data.reduce((sum, item) => sum + item.price, 0) / totalProducts || 0;
    const totalSales = data.reduce((sum, item) => sum + item.price, 0);

    document.getElementById('total-products').innerText = totalProducts;
    document.getElementById('avg-price').innerText = `$${avgPrice.toFixed(2)}`;
    document.getElementById('total-sales').innerText = `$${totalSales.toFixed(2)}`;
  }
