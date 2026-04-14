<%- include('partials/header') %>

<!-- KARTU OWNER -->
<div class="row justify-content-center mb-3">
    <div class="col-md-6">
        <div class="card bg-dark led-card-red">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">👑 OWNER</h5>
                    <img src="https://gangalink.vercel.app/i/blob1kxt.jpg" class="rounded-circle" width="40" height="40" style="object-fit: cover;">
                </div>
                <p class="mt-3"><strong>Nama:</strong> Zenzo Store</p>
                <p><strong>Kontak:</strong> +62 895-3232-47676</p>
                <p><strong>Join sejak:</strong> 2026-04-13</p>
            </div>
        </div>
    </div>
</div>

<!-- KARTU WELCOME -->
<div class="row justify-content-center mb-4">
    <div class="col-md-6">
        <div class="card bg-dark">
            <div class="card-body text-center">
                <img src="https://gangalink.vercel.app/i/xkejgosf.jpg" class="rounded-circle mb-3" width="80" height="80" style="object-fit: cover;">
                <h5>👋 Welcome To Market Zenzo</h5>
                <p>Selamat berbelanja di Zenzo Store!</p>
                <p class="text-muted small">Admin Suka Mie Ayam Lohya!</p>
            </div>
        </div>
    </div>
</div>

<!-- JUDUL -->
<div class="text-center mb-4">
    <h1 class="display-4">👑 Zenzo Store</h1>
    <p class="lead">Market Design Dan Jual Beli 🖌️🎨</p>
    <hr>
</div>

<!-- LIST PRODUK -->
<div class="row">
    <% products.forEach(product => { %>
    <div class="col-md-4 mb-4">
        <div class="card h-100">
            <img src="/uploads/<%= product.image %>" class="card-img-top" style="height: 250px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title"><%= product.name %></h5>
                <p class="card-text"><strong>💰 Harga:</strong> Rp <%= product.price.toLocaleString() %></p>
                <p class="card-text"><strong>📦 Stok:</strong> <%= product.stock %> pcs</p>
                <a href="/checkout/<%= product.id %>" class="btn btn-danger w-100 mt-3">🛒 BELI SEKARANG</a>
            </div>
        </div>
    </div>
    <% }) %>
</div>

<%- include('partials/footer') %>
