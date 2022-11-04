const ethers = require('ethers');

const PUNK_CONTRACT = "0x4DF0AC645703d26760F1715c2867FA6132dE2816";
const STAKING_CONTRACT = '0xD84cBbaf27cEB12d4c7fF3bfEC365B4BC798b856';
const ZENITH_PROVIDER = "https://dataserver-1.zenithchain.co/";

const STAKING_ABI = [
    'constructor(address,uint8)',
    'event OwnershipTransferred(address indexed,address indexed)',
    'function ToggleStaking(bool)',
    'function availableRewards(address) view returns (uint256)',
    'function claimRewards()',
    'function getRewardsStatus() view returns (uint8)',
    'function getStakedTokens(address) view returns (tuple(address,uint256)[])',
    'function getStakingState() view returns (bool)',
    'function nft() view returns (address)',
    'function owner() view returns (address)',
    'function renounceOwnership()',
    'function rewardsPerHourByStatus(uint8) view returns (uint256)',
    'function rewardsStatus() view returns (uint8)',
    'function setRewardStatus(uint8)',
    'function stake(uint256)',
    'function stakeMany(uint256[])',
    'function stakerAddress(uint256) view returns (address)',
    'function stakers(address) view returns (uint256, uint256, uint256)',
    'function totalStaked() view returns (uint256)',
    'function transferOwnership(address)',
    'function unstake(uint256)',
    'function unstakeMany(uint256[])',
    'function withdrawRemains()'
  ];

const NETWORK_SETTINGS = {
    name: 'Zenith Mainent',
    chainId: 79,
}

const TelegramApi = require('node-telegram-bot-api');

const bot = new TelegramApi(process.env.BOT_TOKEN, {
    polling:true
});

bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if(text == '/pool' || text == '/pool@ZenithPunksStaking_bot'){
        const provider = new ethers.providers.JsonRpcProvider(ZENITH_PROVIDER, NETWORK_SETTINGS);
        const contract = new ethers.Contract(STAKING_CONTRACT, STAKING_ABI, provider);

        const balance = ethers.utils.formatEther(await provider.getBalance(contract.address)).toString().substring(0,7);

        bot.sendMessage(chatId,
            `Staking pool balance: <b>${balance} ZENITH</b>.`,{
            parse_mode: 'HTML',
            reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Stake Here', url: 'http://www.zenith-punks.store/stake/'}],
                [{text: 'Mint Here', url: 'https://www.zenith-punks.store/'}],
                [{text: 'How To Stake Video Guide', url: 'https://t.me/zenithpunks/3868'}],
            ]
        })});
    }

    console.log(msg);
});