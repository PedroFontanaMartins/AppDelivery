// Carrinho de compras
const cart = [];
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const notification = document.getElementById('notification');

// Função para abrir o carrinho
function openCart() {
    cartModal.classList.add('open');
    renderCartItems();
}

// Função para fechar o carrinho
document.getElementById('closeCart').addEventListener('click', function() {
    cartModal.classList.remove('open');
});

// Função para adicionar item ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveCart();
    renderCartItems();
    showNotification();
}

// Função para salvar o carrinho no localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved:', cart); // Adicionado para verificação
}

// Função para carregar o carrinho do localStorage
function loadCart() {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
        savedCart.forEach(item => cart.push(item));
    }
    renderCartItems();
}

// Função para renderizar os itens do carrinho
function renderCartItems() {
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} (${item.quantity})</span>
                <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="removeFromCart('${item.name}')">Remover</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        cartTotalElement.textContent = total.toFixed(2);
    }
}

// Função para renderizar os itens na página de checkout
function renderCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const checkoutTotalElement = document.getElementById('checkoutTotal');
    let total = 0;

    if (checkoutItemsContainer && checkoutTotalElement) {
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        checkoutItemsContainer.innerHTML = '';
        if (savedCart) {
            savedCart.forEach(item => {
                total += item.price * item.quantity;
                const checkoutItem = document.createElement('div');
                checkoutItem.classList.add('checkout-item');
                checkoutItem.innerHTML = `
                    <span>${item.name} (${item.quantity})</span>
                    <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                `;
                checkoutItemsContainer.appendChild(checkoutItem);
            });
            checkoutTotalElement.textContent = total.toFixed(2);
        }
        console.log('Checkout items rendered:', savedCart); // Adicionado para verificação
    }
}

// Função para remover item do carrinho
function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex > -1) {
        cart[itemIndex].quantity -= 1;
        if (cart[itemIndex].quantity === 0) {
            cart.splice(itemIndex, 1);
        }
    }
    saveCart();
    renderCartItems();
}

// Função para exibir notificação
function showNotification() {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Adicionar evento ao botão do carrinho no menu de navegação
document.getElementById('cartButton').addEventListener('click', function() {
    openCart();
});

// Adicionar evento aos botões "Adicionar ao Carrinho"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        addToCart(name, price);
    });
});

// Carregar o carrinho ao carregar a página
window.onload = function() {
    loadCart();
    if (window.location.pathname.includes('checkout.html')) {
        renderCheckoutItems();
    }
};

// Evento de clique do botão de checkout
document.getElementById('checkoutButton').addEventListener('click', function() {
    saveCart();
    window.location.href = 'checkout.html';
});

// Evento de submissão do formulário de pagamento
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        const deliveryOption = document.querySelector('input[name="deliveryOption"]:checked').value;

        alert(`Pagamento confirmado! Método: ${paymentMethod}, Opção de entrega: ${deliveryOption}`);
        
        // Aqui você pode adicionar lógica para processar o pagamento

        // Limpar carrinho após pagamento
        cart.length = 0;
        saveCart();
        window.location.href = 'Comidas.html';
    });
}
