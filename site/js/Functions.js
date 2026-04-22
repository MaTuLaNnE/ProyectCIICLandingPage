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


async function obtenerCotizacionesAnteriores() {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await window.supabaseClient
        .from('exchange_rates_history')
        .select('currency_code, rate_brl, reference_date')
        .lt('reference_date', today)
        .order('reference_date', { ascending: false });

    if (error) {
        console.error('Error buscando histórico en Supabase:', error);
        return {};
    }

    const previousRates = {};
    const currencies = ['USD', 'EUR', 'MXN', 'UYU', 'ARS'];

    data.forEach(row => {
        if (currencies.includes(row.currency_code) && !previousRates[row.currency_code]) {
            previousRates[row.currency_code] = Number(row.rate_brl);
        }
    });

    return previousRates;
}

async function guardarCotizacionesDelDia(currentRates) {
    const today = new Date().toISOString().split('T')[0];

    const rows = Object.entries(currentRates).map(([currency, value]) => ({
        currency_code: currency,
        rate_brl: value,
        reference_date: today
    }));

    const { error } = await window.supabaseClient
        .from('exchange_rates_history')
        .upsert(rows, {
            onConflict: 'currency_code,reference_date'
        });

    if (error) {
        console.error('Error guardando cotizaciones del día:', error);
    } else {
        console.log('✅ Cotizaciones del día guardadas en Supabase');
    }
}

function formatearValor(currency, value) {
    let decimals = 2;

    if (currency === 'ARS') decimals = 4;

    return `R$ ${value.toFixed(decimals)}`;
}

function formatearCambio(change) {
    if (change === null || isNaN(change)) {
        return 'Sem histórico';
    }

    if (Math.abs(change) < 0.01) {
        return '0.00%';
    }

    return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
}

function aplicarClaseCambio(changeElement, change) {
    changeElement.className = 'rate-change text-sm mt-1';

    if (change === null || isNaN(change)) {
        changeElement.classList.add('text-gray-500');
    } else if (Math.abs(change) < 0.01) {
        changeElement.classList.add('text-gray-500');
    } else if (change > 0) {
        changeElement.classList.add('text-green-500');
    } else {
        changeElement.classList.add('text-red-500');
    }
}

async function actualizarCotizaciones() {
    console.log("Obteniendo cotizaciones reales...");

    try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/BRL");
        console.log("Respuesta recibida:", response.status);

        const data = await response.json();
        console.log("Datos de la API:", data);

        if (data && data.rates) {
            const currentRates = {
                USD: 1 / data.rates.USD,
                EUR: 1 / data.rates.EUR,
                MXN: 1 / data.rates.MXN,
                UYU: 1 / data.rates.UYU,
                ARS: 1 / data.rates.ARS
            };

            console.log("Tasas calculadas:", currentRates);

            const previousRates = await obtenerCotizacionesAnteriores();

            const items = document.querySelectorAll('.rate-item');
            const currencies = ['USD', 'EUR', 'MXN', 'UYU', 'ARS'];

            currencies.forEach((currency, index) => {
                const currentRate = currentRates[currency];
                const previousRate = previousRates[currency] ?? null;

                console.log(`${currency}/BRL actual: ${currentRate.toFixed(4)}`);
                console.log(`${currency}/BRL anterior:`, previousRate);

                if (items[index]) {
                    const valueElement = items[index].querySelector('.rate-value');
                    const changeElement = items[index].querySelector('.rate-change');

                    valueElement.textContent = formatearValor(currency, currentRate);

                    let change = null;
                    if (previousRate && previousRate !== 0) {
                        change = ((currentRate - previousRate) / previousRate) * 100;
                    }

                    changeElement.textContent = formatearCambio(change);
                    aplicarClaseCambio(changeElement, change);
                }
            });

            await guardarCotizacionesDelDia(currentRates);

            console.log("✅ Cotizaciones actualizadas con datos reales y comparación diaria");
        }
    } catch (error) {
        console.error("❌ Error al obtener tasas:", error);

        const items = document.querySelectorAll('.rate-item');
        items.forEach((item) => {
            if (item) {
                item.querySelector('.rate-value').textContent = 'Error API';
                item.querySelector('.rate-change').textContent = '--';
                item.querySelector('.rate-change').className = 'rate-change text-sm mt-1 text-gray-500';
            }
        });
    }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Iniciando cotizaciones en tiempo real...");
    actualizarCotizaciones();
    
    // Actualizar cada 30 segundos para ver cambios
    setInterval(actualizarCotizaciones, 3000);
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


