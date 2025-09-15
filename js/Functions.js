window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // Here you would implement actual language switching
        console.log('Language switched to:', this.dataset.lang);
    });
});

document.querySelectorAll('.opportunity-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const filter = this.dataset.filter;
        
        // Update active button
        document.querySelectorAll('.opportunity-filters .filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Filter cards
        document.querySelectorAll('.opportunity-card').forEach(card => {
            if (filter === 'all' || card.classList.contains(filter)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

document.querySelectorAll('.event-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const filter = this.dataset.filter;
        
        // Update active button
        document.querySelectorAll('.event-filters .filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Here you would implement actual event filtering
        console.log('Events filtered by:', filter);
    });
});

// Función para newsletter
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input').value;
    
    // Simular suscripción
    alert(`Obrigado! Newsletter enviada para: ${email}`);
    event.target.querySelector('input').value = '';
}

// Back to top functionality
window.addEventListener('scroll', function() {
    const backToTop = document.querySelector('.back-to-top');
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Smooth scroll para los enlaces del footer
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


let previousRates = {};

function actualizarCotizaciones() {
    console.log("Obteniendo cotizaciones reales...");
    
    // API que devuelve todas las monedas en una sola llamada
    fetch("https://api.exchangerate-api.com/v4/latest/BRL")
        .then(response => {
            console.log("Respuesta recibida:", response.status);
            return response.json();
        })
        .then(data => {
            console.log("Datos de la API:", data);
            
            if (data && data.rates) {
                // Convertir las tasas para mostrar cuántos BRL necesitas para comprar 1 unidad de cada moneda
                const currentRates = {
                    USD: 1 / data.rates.USD,  // BRL por USD
                    EUR: 1 / data.rates.EUR,  // BRL por EUR  
                    MXN: 1 / data.rates.MXN,  // BRL por MXN
                    UYU: 1 / data.rates.UYU,  // BRL por UYU
                    ARS: 1 / data.rates.ARS   // BRL por ARS
                };
                
                console.log("Tasas calculadas:", currentRates);
                
                const items = document.querySelectorAll('.rate-item');
                const currencies = ['USD', 'EUR', 'MXN', 'UYU', 'ARS'];
                
                currencies.forEach((currency, index) => {
                    const currentRate = currentRates[currency];
                    const previousRate = previousRates[currency];
                    
                    console.log(`${currency}/BRL: ${currentRate.toFixed(4)}`);
                    
                    // Actualizar valor
                    if (items[index]) {
                        let decimals = currency === 'ARS' ? 4 : 2;
                        items[index].querySelector('.rate-value').textContent = `R$ ${currentRate.toFixed(decimals)}`;
                        
                        // Calcular y mostrar cambio
                        if (previousRate) {
                            const change = ((currentRate - previousRate) / previousRate) * 100;
                            const changeElement = items[index].querySelector('.rate-change');
                            
                            if (Math.abs(change) < 0.01) {
                                changeElement.textContent = '0.00%';
                                changeElement.className = 'rate-change';
                            } else if (change > 0) {
                                changeElement.textContent = `+${change.toFixed(2)}%`;
                                changeElement.className = 'rate-change positive';
                            } else {
                                changeElement.textContent = `${change.toFixed(2)}%`;
                                changeElement.className = 'rate-change negative';
                            }
                        } else {
                            items[index].querySelector('.rate-change').textContent = 'Nuevo';
                        }
                    }
                });
                
                // Guardar tasas actuales para la próxima comparación
                previousRates = { ...currentRates };
                console.log("✅ Cotizaciones actualizadas con datos reales");
            }
        })
        .catch(error => {
            console.error("❌ Error al obtener tasas:", error);
            const items = document.querySelectorAll('.rate-item');
            items.forEach((item, index) => {
                if (item) {
                    item.querySelector('.rate-value').textContent = 'Error API';
                    item.querySelector('.rate-change').textContent = '--';
                }
            });
        });
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Iniciando cotizaciones en tiempo real...");
    actualizarCotizaciones();
    
    // Actualizar cada 30 segundos para ver cambios
    setInterval(actualizarCotizaciones, 30000);
});

// Smooth scrolling para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});



// Seccion de institucional


// Animação de entrada para cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observar todos os cards
document.querySelectorAll('.institutional-card, .objective-item, .participant-card').forEach(card => {
    observer.observe(card);
});

// CSS para animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
