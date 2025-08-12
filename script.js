// Configuração global
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const LAMPORTS_PER_SOL = 1000000000;

// Estado da aplicação
let walletState = {
    connected: false,
    wallet: null,
    publicKey: null,
    balance: null,
    walletName: null
};

// Lista de carteiras suportadas
const SUPPORTED_WALLETS = [
    {
        name: 'Phantom',
        adapter: 'phantom',
        icon: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB3aWR0aD0iMzQiIHZpZXdCb3g9IjAgMCAzNCAzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGxpbmVhckdyYWRpZW50IGlkPSJwaGFudG9tLWdyYWRpZW50IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjEuMTUiIHgyPSIyOS4xMyIgeTE9IjI5LjUiIHkyPSIxLjEzIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzlENzlGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNBQjhERkYiLz4KPC9saW5lYXJHcmFkaWVudD4KPHBhdGggZD0iTTE3IDBDMjYuMzg5IDAgMzQgNy42MTEgMzQgMTdDMzQgMjYuMzg5IDI2LjM4OSAzNCAxNyAzNEM3LjYxMSAzNCAwIDI2LjM4OSAwIDE3QzAgNy42MTEgNy42MTEgMCAxNyAwWiIgZmlsbD0idXJsKCNwaGFudG9tLWdyYWRpZW50KSIvPgo8L3N2Zz4K',
        url: 'https://phantom.app/download',
        deepLink: 'https://phantom.app/ul/browse/' + encodeURIComponent(window.location.href),
        description: 'Carteira popular para Solana'
    },
    {
        name: 'Solflare',
        adapter: 'solflare',
        icon: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgNTAgNTAiIHdpZHRoPSI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJhZGlhbEdyYWRpZW50IGlkPSJhIiBjeD0iMCIgY3k9IjAiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTguMzYwNTMgMTMuMjU5OSAyNC41MjE0IDUuMDA0NTMgMjMuNDgwMSA4LjY5OTkxKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmNkMDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY5NDAwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxwYXRoIGQ9Im0yNS4wIDI1IDI0Ljk5OTEtMjQuOTk5MWgtNDkuOTk4Mmw0OS45OTgyIDQ5Ljk5ODJ2LTI1eiIgZmlsbD0idXJsKCNhKSIvPgo8L3N2Zz4K',
        url: 'https://solflare.com/download',
        deepLink: 'https://solflare.com/ul/v1/connect?uri=' + encodeURIComponent(window.location.href),
        description: 'Carteira segura com suporte NFT'
    },
    {
        name: 'Backpack',
        adapter: 'backpack',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTI1IDI1SDc1VjMwSDI1VjI1WiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K',
        url: 'https://www.backpack.app/download',
        deepLink: 'backpack://connect?uri=' + encodeURIComponent(window.location.href),
        description: 'Carteira moderna da Coral'
    },
    {
        name: 'Glow',
        adapter: 'glow',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjRkZEODAwIi8+Cjwvc3ZnPg==',
        url: 'https://glow.app/download',
        deepLink: 'glow://connect?uri=' + encodeURIComponent(window.location.href),
        description: 'Carteira com foco em DeFi'
    }
];

// Elementos DOM
const elements = {
    connectBtn: document.getElementById('connectBtn'),
    disconnectBtn: document.getElementById('disconnectBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    copyBtn: document.getElementById('copyBtn'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalClose: document.getElementById('modalClose'),
    walletOptions: document.getElementById('walletOptions'),
    disconnectedState: document.getElementById('disconnectedState'),
    connectedState: document.getElementById('connectedState'),
    loadingState: document.getElementById('loadingState'),
    walletAddress: document.getElementById('walletAddress'),
    walletBalance: document.getElementById('walletBalance'),
    walletName: document.getElementById('walletName'),
    connectLoader: document.getElementById('connectLoader'),
    toastContainer: document.getElementById('toastContainer')
};

// Utilitários
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>`,
        error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/></svg>`,
        info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`
    };
    
    toast.innerHTML = `
        <div class="toast-icon" style="color: ${type === 'success' ? '#14F195' : type === 'error' ? '#FF4757' : '#9945FF'}">
            ${icons[type]}
        </div>
        <div class="toast-message">${message}</div>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

function formatBalance(lamports) {
    if (lamports === null || lamports === undefined) return '0.00';
    const sol = lamports / LAMPORTS_PER_SOL;
    return sol.toFixed(4);
}

function truncateAddress(address, length = 8) {
    if (!address) return '';
    if (address.length <= length * 2) return address;
    return `${address.slice(0, length)}...${address.slice(-length)}`;
}

function detectMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return isMobile || (isTablet && isTouchDevice);
}

function detectWallet(walletName) {
    const isMobile = detectMobile();
    if (isMobile) {
        return true; // Assumir que a carteira pode estar instalada no mobile
    }
    
    const phantom = window.phantom?.solana;
    const solflare = window.solflare;
    const backpack = window.backpack;
    const glow = window.glow;
    
    switch (walletName) {
        case 'phantom':
            return phantom && phantom.isPhantom;
        case 'solflare':
            return solflare && solflare.isSolflare;
        case 'backpack':
            return backpack && backpack.isBackpack;
        case 'glow':
            return glow;
        default:
            return window.solana;
    }
}

async function getConnection() {
    if (!window.solanaWeb3) {
        throw new Error('Solana Web3.js não está disponível');
    }
    return new window.solanaWeb3.Connection(SOLANA_RPC_URL, 'confirmed');
}

async function getBalance(publicKey) {
    try {
        const connection = await getConnection();
        const balance = await connection.getBalance(new window.solanaWeb3.PublicKey(publicKey));
        return balance;
    } catch (error) {
        console.error('Erro ao obter saldo:', error);
        return null;
    }
}

// Interface de Carteiras
class WalletInterface {
    constructor(walletConfig) {
        this.config = walletConfig;
        this.wallet = null;
    }
    
    async connect() {
        const isMobile = detectMobile();
        const walletAdapter = !isMobile ? detectWallet(this.config.adapter) : null;
        
        if (isMobile) {
            showToast(`Abrindo ${this.config.name}...`, 'info');
            console.log(`Tentando abrir deep link para ${this.config.name}: ${this.config.deepLink}`);
            
            // Tentar abrir o deep link usando múltiplos métodos
            const deepLinkUrl = this.config.deepLink;
            
            // Método 1: Usar iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = deepLinkUrl;
            document.body.appendChild(iframe);
            
            // Método 2: Usar window.location.href
            setTimeout(() => {
                window.location.href = deepLinkUrl;
                document.body.removeChild(iframe);
            }, 500);
            
            // Método 3: Fallback para window.open
            setTimeout(() => {
                window.open(deepLinkUrl, '_blank');
            }, 1000);
            
            // Fallback para página de download após 5 segundos
            setTimeout(() => {
                if (!walletState.connected) {
                    showToast(`Se ${this.config.name} não abriu, baixe o aplicativo.`, 'info', 5000);
                    window.open(this.config.url, '_blank');
                }
            }, 5000);
            
            // Polling para verificar conexão
            let attempts = 0;
            const maxAttempts = 10;
            return new Promise((resolve) => {
                const checkConnection = setInterval(async () => {
                    attempts++;
                    if (this.config.adapter === 'phantom' && window.phantom?.solana?.isConnected) {
                        clearInterval(checkConnection);
                        this.wallet = window.phantom.solana;
                        const publicKey = this.wallet.publicKey.toString();
                        console.log(`Conexão bem-sucedida com ${this.config.name} no mobile. PublicKey: ${publicKey}`);
                        resolve({ publicKey, wallet: this.wallet, name: this.config.name });
                    } else if (this.config.adapter === 'solflare' && window.solflare?.isConnected) {
                        clearInterval(checkConnection);
                        this.wallet = window.solflare;
                        const publicKey = this.wallet.publicKey.toString();
                        console.log(`Conexão bem-sucedida com ${this.config.name} no mobile. PublicKey: ${publicKey}`);
                        resolve({ publicKey, wallet: this.wallet, name: this.config.name });
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkConnection);
                        console.log(`Timeout na conexão com ${this.config.name} no mobile`);
                        resolve(null);
                    }
                }, 1000);
            });
        }
        
        if (!walletAdapter) {
            showToast(`${this.config.name} não está instalada`, 'error');
            window.open(this.config.url, '_blank');
            console.log(`Carteira ${this.config.name} não detectada no desktop`);
            return null;
        }
        
        try {
            let response;
            switch (this.config.adapter) {
                case 'phantom':
                    response = await window.phantom.solana.connect();
                    this.wallet = window.phantom.solana;
                    break;
                case 'solflare':
                    response = await window.solflare.connect();
                    this.wallet = window.solflare;
                    break;
                case 'backpack':
                    response = await window.backpack.connect();
                    this.wallet = window.backpack;
                    break;
                case 'glow':
                    response = await window.glow.connect();
                    this.wallet = window.glow;
                    break;
                default:
                    response = await walletAdapter.connect();
                    this.wallet = walletAdapter;
            }
            
            if (response && response.publicKey) {
                console.log(`Conexão bem-sucedida com ${this.config.name}. PublicKey: ${response.publicKey.toString()}`);
                return {
                    publicKey: response.publicKey.toString(),
                    wallet: this.wallet,
                    name: this.config.name
                };
            }
            
            console.log(`Nenhuma chave pública retornada por ${this.config.name}`);
            return null;
        } catch (error) {
            console.error(`Erro ao conectar ${this.config.name}:`, error);
            if (error.message.includes('User rejected')) {
                showToast('Conexão cancelada pelo usuário', 'info');
            } else {
                showToast(`Erro ao conectar: ${error.message}`, 'error');
            }
            return null;
        }
    }
    
    async disconnect() {
        try {
            if (this.wallet && this.wallet.disconnect) {
                await this.wallet.disconnect();
            }
            this.wallet = null;
            console.log(`Carteira ${this.config.name} desconectada`);
            return true;
        } catch (error) {
            console.error('Erro ao desconectar:', error);
            return false;
        }
    }
}

// Gerenciador de Estados
function showState(state) {
    elements.disconnectedState.classList.add('hidden');
    elements.connectedState.classList.add('hidden');
    elements.loadingState.classList.add('hidden');
    
    elements[`${state}State`].classList.remove('hidden');
}

function updateConnectedState() {
    if (!walletState.connected) return;
    
    elements.walletAddress.textContent = truncateAddress(walletState.publicKey, 6);
    elements.walletBalance.textContent = formatBalance(walletState.balance) + ' SOL';
    elements.walletName.textContent = walletState.walletName || 'Desconhecida';
    
    showState('connected');
}

// Funcionalidades das Carteiras
async function connectWallet(walletConfig) {
    showState('loading');
    elements.connectBtn.classList.add('loading');
    
    try {
        const walletInterface = new WalletInterface(walletConfig);
        const result = await walletInterface.connect();
        
        if (result) {
            walletState.connected = true;
            walletState.wallet = result.wallet;
            walletState.publicKey = result.publicKey;
            walletState.walletName = result.name;
            
            const balance = await getBalance(result.publicKey);
            walletState.balance = balance;
            
            updateConnectedState();
            showToast(`${result.name} conectada com sucesso!`, 'success');
            closeModal();
            
            localStorage.setItem('walletState', JSON.stringify({
                walletName: result.name,
                publicKey: result.publicKey
            }));
        } else {
            showState('disconnected');
        }
    } catch (error) {
        console.error('Erro na conexão:', error);
        showToast('Erro ao conectar carteira', 'error');
        showState('disconnected');
    } finally {
        elements.connectBtn.classList.remove('loading');
    }
}

async function disconnectWallet() {
    try {
        if (walletState.wallet && walletState.wallet.disconnect) {
            await walletState.wallet.disconnect();
        }
        
        walletState.connected = false;
        walletState.wallet = null;
        walletState.publicKey = null;
        walletState.balance = null;
        walletState.walletName = null;
        
        showState('disconnected');
        showToast('Carteira desconectada', 'info');
        
        localStorage.removeItem('walletState');
    } catch (error) {
        console.error('Erro ao desconectar:', error);
        showToast('Erro ao desconectar carteira', 'error');
    }
}

async function refreshBalance() {
    if (!walletState.connected || !walletState.publicKey) return;
    
    elements.refreshBtn.innerHTML = `
        <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        Atualizando...
    `;
    elements.refreshBtn.disabled = true;
    
    try {
        const balance = await getBalance(walletState.publicKey);
        walletState.balance = balance;
        updateConnectedState();
        showToast('Saldo atualizado', 'success');
    } catch (error) {
        console.error('Erro ao atualizar saldo:', error);
        showToast('Erro ao atualizar saldo', 'error');
    } finally {
        elements.refreshBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M3 21v-5h5"/>
            </svg>
            Atualizar
        `;
        elements.refreshBtn.disabled = false;
    }
}

function copyAddress() {
    if (!walletState.publicKey) return;
    
    navigator.clipboard.writeText(walletState.publicKey).then(() => {
        showToast('Endereço copiado!', 'success');
        elements.copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
            </svg>
        `;
        
        setTimeout(() => {
            elements.copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
            `;
        }, 2000);
    }).catch(() => {
        showToast('Erro ao copiar endereço', 'error');
    });
}

// Modal
function openModal() {
    elements.modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    populateWalletOptions();
}

function closeModal() {
    elements.modalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

function populateWalletOptions() {
    elements.walletOptions.innerHTML = '';
    
    SUPPORTED_WALLETS.forEach(wallet => {
        const isMobile = detectMobile();
        const isInstalled = detectWallet(wallet.adapter);
        
        const option = document.createElement('div');
        option.className = 'wallet-option';
        
        option.innerHTML = `
            <img src="${wallet.icon}" alt="${wallet.name}" style="background: white; border-radius: 8px;">
            <div class="wallet-option-info">
                <div class="wallet-option-name">${wallet.name}</div>
                <div class="wallet-option-description">${wallet.description}</div>
            </div>
            <div class="wallet-status ${isMobile ? 'available' : isInstalled ? 'available' : 'not-installed'}">
                ${isMobile ? 'Abrir App' : isInstalled ? 'Instalada' : 'Instalar'}
            </div>
        `;
        
        option.addEventListener('click', () => connectWallet(wallet));
        
        elements.walletOptions.appendChild(option);
    });
}

// Reconexão automática
async function tryAutoReconnect() {
    const savedState = localStorage.getItem('walletState');
    if (!savedState) return;
    
    try {
        const { walletName, publicKey } = JSON.parse(savedState);
        const walletConfig = SUPPORTED_WALLETS.find(w => w.name === walletName);
        
        if (walletConfig && detectWallet(walletConfig.adapter)) {
            const walletAdapter = walletConfig.adapter === 'phantom' ? window.phantom?.solana :
                                 walletConfig.adapter === 'solflare' ? window.solflare :
                                 walletConfig.adapter === 'backpack' ? window.backpack :
                                 window.glow;
            if (walletAdapter && walletAdapter.isConnected) {
                walletState.connected = true;
                walletState.wallet = walletAdapter;
                walletState.publicKey = publicKey;
                walletState.walletName = walletName;
                
                const balance = await getBalance(publicKey);
                walletState.balance = balance;
                
                updateConnectedState();
                showToast('Carteira reconectada automaticamente', 'success');
                console.log(`Reconexão automática bem-sucedida para ${walletName}`);
            }
        }
    } catch (error) {
        console.error('Erro na reconexão automática:', error);
        localStorage.removeItem('walletState');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Botões principais
    elements.connectBtn.addEventListener('click', openModal);
    elements.disconnectBtn.addEventListener('click', disconnectWallet);
    elements.refreshBtn.addEventListener('click', refreshBalance);
    elements.copyBtn.addEventListener('click', copyAddress);
    
    // Modal
    elements.modalClose.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) {
            closeModal();
        }
    });
    
    // ESC para fechar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Tentar reconexão automática
    setTimeout(tryAutoReconnect, 1000);
    
    // Listeners para eventos de carteira
    if (window.phantom?.solana) {
        window.phantom.solana.on('disconnect', () => {
            if (walletState.walletName === 'Phantom') {
                disconnectWallet();
                console.log('Phantom desconectado via evento');
            }
        });
        window.phantom.solana.on('accountChanged', (publicKey) => {
            if (walletState.connected && walletState.walletName === 'Phantom') {
                if (publicKey) {
                    walletState.publicKey = publicKey.toString();
                    refreshBalance();
                    showToast('Conta alterada', 'info');
                    console.log('Conta Phantom alterada:', publicKey.toString());
                } else {
                    disconnectWallet();
                }
            }
        });
    }
    
    if (window.solflare) {
        window.solflare.on('disconnect', () => {
            if (walletState.walletName === 'Solflare') {
                disconnectWallet();
                console.log('Solflare desconectado via evento');
            }
        });
        window.solflare.on('accountChanged', (publicKey) => {
            if (walletState.connected && walletState.walletName === 'Solflare') {
                if (publicKey) {
                    walletState.publicKey = publicKey.toString();
                    refreshBalance();
                    showToast('Conta alterada', 'info');
                    console.log('Conta Solflare alterada:', publicKey.toString());
                } else {
                    disconnectWallet();
                }
            }
        });
    }
});

// Verificar se Solana Web3 está disponível
if (typeof window.solanaWeb3 === 'undefined') {
    showToast('Carregando biblioteca Solana...', 'info');
    
    const checkSolanaWeb3 = setInterval(() => {
        if (typeof window.solanaWeb3 !== 'undefined') {
            clearInterval(checkSolanaWeb3);
            showToast('Biblioteca Solana carregada!', 'success');
            console.log('Solana Web3.js carregado com sucesso');
        }
    }, 1000);
    
    setTimeout(() => {
        if (typeof window.solanaWeb3 === 'undefined') {
            clearInterval(checkSolanaWeb3);
            showToast('Erro ao carregar biblioteca Solana', 'error');
            console.error('Falha ao carregar Solana Web3.js após 10 segundos');
        }
    }, 10000);
}

// Debug info (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🚀 Solana Wallet Connect Debug Mode');
    console.log('📱 Mobile:', detectMobile());
    console.log('🌐 User Agent:', navigator.userAgent);
    console.log('💰 Carteiras detectadas:', {
        phantom: !!window.phantom?.solana,
        solflare: !!window.solflare,
        backpack: !!window.backpack,
        glow: !!window.glow
    });
    
    if (detectMobile()) {
        console.log('📲 Testando deep links para mobile...');
        SUPPORTED_WALLETS.forEach(wallet => {
            console.log(`${wallet.name}: ${wallet.deepLink}`);
        });
    }
}