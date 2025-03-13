import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLanguage } from "@/i18n/context";

export default function ConnectWallet() {
  const { language } = useLanguage();

  return (
    <div className="scale-90 origin-right">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="pixel-button bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      {language === 'en' ? 'Connect Wallet' : '连接钱包'}
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      className="pixel-button bg-red-500 hover:bg-red-600"
                    >
                      {language === 'en' ? 'Wrong Network' : '错误网络'}
                    </button>
                  );
                }

                return (
                  <div className="flex gap-2">
                    <button
                      onClick={openChainModal}
                      className="pixel-button bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                      {chain.name}
                    </button>
                    <button
                      onClick={openAccountModal}
                      className="pixel-button bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      {account.displayName}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
