import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Copy, ExternalLink, Wallet, Check } from 'lucide-react';

export const WalletInfo: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, disconnect } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!connection || !publicKey) {
      setBalance(null);
      return;
    }

    // Buscar saldo da carteira
    const fetchBalance = async () => {
      try {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Erro ao buscar saldo:', error);
        setBalance(null);
      }
    };

    fetchBalance();

    // Atualizar saldo a cada 10 segundos
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [connection, publicKey]);

  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openInExplorer = () => {
    if (publicKey) {
      window.open(`https://solscan.io/account/${publicKey.toString()}`, '_blank');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  if (!publicKey) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card da Carteira */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Endereço */}
        <div className="text-center mb-6">
          <p className="text-white/70 text-sm mb-2">Endereço da Carteira</p>
          <div className="flex items-center justify-center gap-2 bg-white/5 rounded-lg p-3">
            <span className="text-white font-mono text-lg">
              {formatAddress(publicKey.toString())}
            </span>
            <button
              onClick={copyAddress}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-white/70 hover:text-white"
              title="Copiar endereço"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={openInExplorer}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-white/70 hover:text-white"
              title="Ver no Solscan"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Saldo */}
        <div className="text-center mb-8">
          <p className="text-white/70 text-sm mb-2">Saldo</p>
          <div className="text-4xl font-bold text-white">
            {balance !== null ? (
              <>
                {balance.toFixed(4)} <span className="text-2xl text-purple-300">SOL</span>
              </>
            ) : (
              <div className="animate-pulse bg-white/20 h-12 w-32 mx-auto rounded-lg"></div>
            )}
          </div>
          {balance !== null && (
            <p className="text-white/50 text-sm mt-2">
              ≈ ${(balance * 100).toFixed(2)} USD
            </p>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-4">
          <button
            onClick={disconnect}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Desconectar
          </button>
        </div>
      </div>

      {/* Informações da Rede */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/70">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Conectado à Mainnet</span>
        </div>
      </div>
    </div>
  );
};