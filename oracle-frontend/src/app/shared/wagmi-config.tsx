import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { arbitrum, mainnet,polygon,polygonAmoy,polygonMumbai } from '@reown/appkit/networks';

export const projectId = '2a8f99b77dfc92c90c93b71e122a2215';

export const wagmiMetaData = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet,polygon,polygonAmoy,polygonMumbai, arbitrum],
  projectId,
});
