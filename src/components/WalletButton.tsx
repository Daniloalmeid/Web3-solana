import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';

export const WalletButton: React.FC = () => {
  const { connected } = useWallet();

  if (connected) return null;

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {/* Ícone */}
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
          <Wallet className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Título */}
      <h1 className="text-4xl font-bold text-white mb-4">
        Conectar Carteira
      </h1>
      
      <p className="text-white/70 mb-8 text-lg leading-relaxed">
        Conecte sua carteira Solana para começar a usar nossos serviços Web3. 
        Suporte completo para desktop e mobile.
      </p>

      {/* Botão de Conexão Customizado */}
      <div className="wallet-adapter-button-container">
        <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !rounded-xl !py-4 !px-8 !text-lg !font-semibold !transition-all !duration-300 !transform hover:!scale-105 active:!scale-95 !shadow-2xl !border-0" />
      </div>

      {/* Carteiras Suportadas */}
      <div className="mt-12">
        <p className="text-white/50 text-sm mb-4">Carteiras Suportadas</p>
        <div className="flex flex-wrap justify-center gap-4">
          {['Phantom', 'Solflare', 'Backpack', 'Coinbase', 'Trust'].map((wallet) => (
            <div 
              key={wallet}
              className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-white/70 text-sm"
            >
              {wallet}
            </div>
          ))}
        </div>
      </div>

      {/* Recursos */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">🔒 Seguro</h3>
          <p className="text-white/60 text-sm">Suas chaves privadas permanecem seguras em sua carteira</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">📱 Universal</h3>
          <p className="text-white/60 text-sm">Funciona em desktop e mobile, iOS e Android</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">⚡ Rápido</h3>
          <p className="text-white/60 text-sm">Conexão instantânea e transações eficientes</p>
        </div>
      </div>
    </div>
  );
};