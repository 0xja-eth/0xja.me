import { CHALLENGE_FACTORY_ABI } from "./ChallengeFactory";
import { BLOG_CHALLENGE_ABI } from "./BlogChallenge";
import { ERC20_ABI } from "./ERC20";
import { TEST_TOKEN_ABI } from "./TestToken";

import { mainnet, arbitrum, optimism, polygon, base, bsc, optimismSepolia, arbitrumSepolia } from 'wagmi/chains';
import { useConfig } from "wagmi";

export const ContractABIs = {
    ChallengeFactory: CHALLENGE_FACTORY_ABI,
    BlogChallenge: BLOG_CHALLENGE_ABI,
    ERC20: ERC20_ABI,
    TestToken: TEST_TOKEN_ABI
} as const

export const ContractAddresses: Record<number, Record<string, `0x${string}`>> = {
    [optimismSepolia.id]: {
        ChallengeFactory: "0xfC6779B765e59aF00683099FE20E9Fe618e0E13c",
        USDT: "0x37d2bf5Af3D2F9fA8c8f4E20Bc6F78e54D6ccBc1",
        TestToken: "0x37d2bf5Af3D2F9fA8c8f4E20Bc6F78e54D6ccBc1"
    },
    // [optimism.id]: {
    //     USDT: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58"
    // }
    [arbitrum.id]: {
        ChallengeFactory: "0x64F158971c890EF2F7f9e5a87E9486379CbB7b88",
        USDT: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    },
    [arbitrumSepolia.id]: {
        ChallengeFactory: "0x742742191f21D52F98043139C647dAcec71697A6",
        USDT: "0x37d2bf5Af3D2F9fA8c8f4E20Bc6F78e54D6ccBc1",
        TestToken: "0x37d2bf5Af3D2F9fA8c8f4E20Bc6F78e54D6ccBc1"
    }
}

export const SupportedChains = [mainnet, arbitrum, optimism, polygon, base, bsc, optimismSepolia, arbitrumSepolia] as const;
export const BlogChallengeSupportedChains = Object.keys(ContractAddresses).map(chainId => 
    SupportedChains.find(chain => chain.id === Number(chainId))
).filter(Boolean);

export function useContract<T extends keyof typeof ContractABIs>(chainId: number, name: T, address?: `0x${string}`) {
    address ||= ContractAddresses[chainId]?.[name];

    return {
        address,
        abi: ContractABIs[name],
        chainId,
        isValidChain: Object.keys(ContractAddresses).includes(chainId?.toString())
    };
}

export function useExplorer(chainId: number) {
    const { chains } = useConfig();
    const chain = chains.find(chain => chain.id === chainId);
    const blockExplorerUrl = chain?.blockExplorers?.default?.url;
    
    return {
        viewTx: (txHash: string) => {
            if (!blockExplorerUrl) return;
            window.open(`${blockExplorerUrl}/tx/${txHash}`, '_blank');
        },
        viewBlock: (blockHash: string) => {
            if (!blockExplorerUrl) return;
            window.open(`${blockExplorerUrl}/block/${blockHash}`, '_blank');
        },
        viewAddress: (address: string) => {
            if (!blockExplorerUrl) return;
            window.open(`${blockExplorerUrl}/address/${address}`, '_blank');
        },
        open: () => {
            if (!blockExplorerUrl) return;
            window.open(blockExplorerUrl, '_blank');
        },
        txUrl: (txHash: string) => {
            if (!blockExplorerUrl) return;
            return `${blockExplorerUrl}/tx/${txHash}`;
        },
        blockUrl: (blockHash: string) => {
            if (!blockExplorerUrl) return;
            return `${blockExplorerUrl}/block/${blockHash}`;
        },
        addressUrl: (address: string) => {
            if (!blockExplorerUrl) return;
            return `${blockExplorerUrl}/address/${address}`;
        },
        blockExplorerUrl
    }
}