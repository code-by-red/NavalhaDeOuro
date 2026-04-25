// Configurações do sistema
const CONFIG = {
    // Número do WhatsApp (fácil de editar)
    whatsappNumber: '5511922048764',
    
    // Preços dos serviços
    prices: {
        'Degrade': 25,
        'Barba': 10,
        'Sobrancelha': 5,
        'Cabelo + Barba': 35,
        'Pigmentação': 45,
        'Luzes': 60,
        'Reflexo': 70,
        'Platinado': 90
    }
};

// Função para rolar até a seção de agendamento
function scrollToBooking() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}


// Função para atualizar o preço com base no serviço selecionado
function updatePrice() {
    const selectedService = document.querySelector('input[name="service"]:checked');
    const priceDisplay = document.getElementById('priceDisplay');
    const priceValue = document.getElementById('priceValue');
    
    if (selectedService) {
        const serviceName = selectedService.value;
        const price = CONFIG.prices[serviceName] || 0;
        
        // Mostra o display de preço
        priceDisplay.style.display = 'block';
        
        // Animação do valor
        animatePrice(priceValue, price);
    } else {
        // Esconde o display se não houver serviço selecionado
        priceDisplay.style.display = 'none';
    }
}

// Função para animar o valor do preço
function animatePrice(element, targetPrice) {
    const duration = 500;
    const startPrice = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentPrice = Math.floor(startPrice + (targetPrice - startPrice) * progress);
        element.textContent = `R$ ${currentPrice}`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Função para validar o formulário
function validateForm() {
    const service = document.querySelector('input[name="service"]:checked');
    const day = document.querySelector('input[name="day"]:checked');
    const period = document.querySelector('input[name="period"]:checked');
    
    const errors = [];
    
    if (!service) {
        errors.push('Por favor, selecione um serviço.');
    }
    
    if (!day) {
        errors.push('Por favor, selecione quando você prefere.');
    }
    
    if (!period) {
        errors.push('Por favor, selecione o período desejado.');
    }
    
    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return false;
    }
    
    return true;
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Remove notificações existentes
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Função principal para enviar mensagem ao WhatsApp
function sendToWhatsApp() {
    // Valida o formulário
    if (!validateForm()) {
        return;
    }
    
    // Coleta os dados do formulário
    const service = document.querySelector('input[name="service"]:checked').value;
    const day = document.querySelector('input[name="day"]:checked').value;
    const period = document.querySelector('input[name="period"]:checked').value;
    
    // Monta a mensagem
    const message = `*Navalha de Ouro - Barbearia Premium*\n\nOlá! Gostaria de agendar um horário em sua barbearia premium.\n\n*Serviço Desejado:* ${service}\n*Preferência de Dia:* ${day}\n*Período Desejado:* ${period}\n\nPoderiam me informar os horários disponíveis? Aguardo contato.\n\n*Atenciosamente,*\nCliente Navalha de Ouro`;
    
    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Monta a URL do WhatsApp
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
    
    // Mostra notificação de carregamento
    showNotification('Redirecionando para o WhatsApp...', 'info');
    
    // Redireciona para o WhatsApp
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 500);
}

// Função para adicionar efeitos visuais aos campos do formulário
function addFormInteractions() {
    // Adiciona efeito de seleção aos radio buttons
    const radioOptions = document.querySelectorAll('.radio-option');
    
    radioOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove a classe 'selected' de todas as opções do mesmo grupo
            const name = this.querySelector('input[type="radio"]').name;
            document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
                input.closest('.radio-option').classList.remove('selected');
            });
            
            // Adiciona a classe 'selected' à opção clicada
            this.classList.add('selected');
            
            // Dispara o change para atualizar o preço se for serviço
            const input = this.querySelector('input[type="radio"]');
            if (input.name === 'service') {
                updatePrice();
            }
        });
    });
}

// Função para animar elementos na rolagem
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observa elementos que devem ser animados
    const animateElements = document.querySelectorAll('.benefit-card, .form-group');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Função para manter header consistente (sem efeitos de scroll)
function headerScrollEffect() {
    // Header mantém aparência fixa durante toda navegação
    // Nenhuma alteração de cor ou estilo ao rolar
}

// Função para adicionar CSS de animações adicionais
function addAdditionalCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .radio-option.selected {
            background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
            border-color: #667eea;
            transform: scale(1.02);
        }
        
        .radio-option.selected .radio-custom {
            border-color: #667eea;
            background: #667eea;
        }
        
        .radio-option.selected .radio-custom::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
        }
        
        /* Animação de pulse no botão WhatsApp */
        @keyframes pulse {
            0% {
                box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
            }
            50% {
                box-shadow: 0 10px 35px rgba(37, 211, 102, 0.5);
            }
            100% {
                box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
            }
        }
        
        .whatsapp-float {
            animation: pulse 2s infinite;
        }
        
        /* Efeito hover nos cards */
        .benefit-card:hover .benefit-icon {
            transform: scale(1.1);
        }
        
        .benefit-icon {
            transition: transform 0.3s ease;
        }
        
        /* Loading spinner */
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Função para inicializar a aplicação
function initApp() {
    // Adiciona CSS adicional
    addAdditionalCSS();
    
    // Adiciona interações ao formulário
    addFormInteractions();
    
    // Configura animações na rolagem
    animateOnScroll();
    
    // Configura efeito do header
    headerScrollEffect();
    
    // Adiciona smooth scroll para links de navegação
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
    
    // Remove efeitos de scroll que alteram o header
    // Header mantém aparência consistente durante toda navegação
    
    console.log('BarberCode - Sistema de Agendamento inicializado com sucesso!');
}

// Função para depuração (pode ser removida em produção)
function debugForm() {
    const formData = {
        service: document.querySelector('input[name="service"]:checked')?.value || null,
        day: document.querySelector('input[name="day"]:checked')?.value || null,
        period: document.querySelector('input[name="period"]:checked')?.value || null
    };
    
    console.log('Dados do formulário:', formData);
    return formData;
}

// Função para controlar o menu mobile
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Fecha o menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
            });
        });
        
        // Fecha o menu ao clicar fora
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !nav.contains(event.target)) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    initMobileMenu();
});

// Adiciona suporte para teclado (acessibilidade)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('radio-option')) {
            activeElement.click();
        }
    }
});

// Exporta funções para uso global (se necessário)
window.BarberCode = {
    scrollToBooking,
    updatePrice,
    sendToWhatsApp,
    debugForm,
    CONFIG
};
