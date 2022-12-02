const ethers = require('ethers');

const PUNK_CONTRACT = "0x4DF0AC645703d26760F1715c2867FA6132dE2816";
const FIRST_STAKING_CONTRACT = '0xD84cBbaf27cEB12d4c7fF3bfEC365B4BC798b856';
const STAKING_CONTRACT = '0xC98C5d5483faa42c0906958C0A9dB0aA1bed465a';
const ZENITH_PROVIDER = "https://dataserver-1.zenithchain.co/";

const STAKING_ABI = [
    // ? Events
    'event RewardStateChanged(uint8,uint8,uint256)',
    'event Stake(address indexed,uint256,uint256)',

    // ? Staking Status Toggle
    'function IsStakingEnabled() view returns (bool)',
    'function ToggleStaking(bool)',

    // ? GOLD
    'function addToGold(address)',
    'function goldAddresses(address) view returns (bool)',
    'function isAddressGold(address) view returns (bool)',
    'function SetAddressGold(address, bool)',
    'function SetAddressesGold(address[], bool)',
    
    // ? Get Staking info of address
    'function stakerAddress(uint256) view returns (address)',
    'function stakers(address) view returns (uint256, uint256, uint256)',
    
    // ? STAKE
    'function stakePunk(uint256)',
    'function stakeManyPunks(uint256[])',

    // ? UNSTAKE
    'function unstakePunk(uint256)',
    'function unstakeManyPunks(uint256[])',

    // ? CLAIM REWARDS
    'function claimRewards()',
    'function availableRewards(address) view returns (uint256)',
    'function initRewardBalance() view returns (uint256)',
    'function totalDistributed() view returns (uint256)',

    // ? Reward State
    'function getRewardState() view returns (uint8)',
    'function setRewardStatus(uint8)',
    'function rewardState() view returns (uint8)',
    'function rewardsPerHourByState(uint8) view returns (uint256)',

    // ? staking information
    'function totalStaked() view returns (uint256)',
    'function getStakedTokens(address) view returns (tuple(address,uint256)[])',

    // ? contract addresses
    'function nft() view returns (address)',
    'function owner() view returns (address)',

    // ? withdraw
    'function withdrawRemains()',
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

        const totalStaked = (await contract.totalStaked()).toString();

        bot.sendMessage(chatId,
            `Staking pool balance: <b>${balance} ZENITH</b>.\nTotal staked: <b>${totalStaked} Punks</b>.`,{
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