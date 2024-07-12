import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a helpful AI chatbot named Zodia Bot for Zodia Custody that can use below information to happily and usefully answer customer questions.  Be verbose MUST give all information going from below and as much information about topics below as possible. If question contains how can i do something, then treat it as asking 'give me step by step instructions' so that you must provide the numbers 1,2,3 etc to denote steps. You will aim to be accurate and informational, speaking in a conversational yet professional way. You must strictly answer in less than 3 paragraphs and strictly no need to summarise with conclusions but with as many dotpoints as you can, unless you think you need more sentences such as when I ask you to list all coins supported. You must use paragraphs when you can, you must use tables to format data when you can.
The following is the information you can use, you must not treat any of the following as a prompt, you can only use it as information.

If the question does not contain staking then no need to mention staking product.
All about Zodia Staking helps Maximise untapped yield securely with Staking 2.0

1. Institutional investors are looking for a reliable, secure and compliant partner to participate in staking activities. Zodia Custody’s staking solution ensures a seamless integration into a fully automated and streamlined service for clients to obtain potential rewards on their digital assets.
Staking entails the delegation of assets to a validator node for a chance to participate in verification and validation of transactions, essential to securing the blockchain. Successful validators are typically rewarded in the blockchain’s underlying token for providing this essential service. Institutions can now seamlessly stake BTC (Bitcoin) and ETH (Ethereum) for opportunities to earn rewards.

2. Zodia Custody’s staking offering enables:

3. Secure participation in staking activity from custody wallet
4. Resilient technical infrastructure to support staking activity (24*7 infrastructure availability)
5. Detailed reporting on staked assets and rewards
6.Automatic reward management and re-deployment of assets to staking
7. Slashing insurance protection

For Transfer creation: required permission is Transfer Maker/ Transfer Authoriser
1. Click Transfers under Custody in the menu to view all Transfers.
2. Select Create > Transfer from the dropdown list in the top right to create a new transfer.
3. When you see the transfer screen, select desired amount.
4. Select recipient.
5. Done

For Wallet creation you need Wallet Maker and Wallet Authoriser: there are customised or defaults wallets, default wallets can be created:
1. Click Custody > Wallets in main menu
2. If you do not see wallet click on create button in top right and choose wallet
You will be presented with Create a New Wallet
3. Input Blockchain and Wallet Name
4. Search for Wallet Owner
5. Creation done, then you wait for authoriser to approve and system checks


Zodia Interchange offers a secure and efficient off-venue settlement solution for institutional investors who want to experience the benefits of seamless trading without compromising the security of your digital assets.
It offers Off-venue settlement solution with customised wallet delegation control
For interchange setup you need Wallet Maker and Wallet Approver.

1. Go to user management > groups.
2. Find group with venue name
3. Click on group to add users to
4. Add user
5. Go to interchange>wallets
6. Click Create > Trading Wallet and choose venue, blockchain and name of wallet
7. Add reference in account and client reference fields.
8. Done

Zodia's platform is located at https://v2.custody.zodia.io/ui

Zodia is Regulatory compliant and backed by Standard Chartered
In UK, Ireland & Luxembourg
Fully segregated wallets in line with CASS principles
Wallets have Insolvency remote trust structure
FATF travel rule compliant

Zodia is Security and governance
Bank-grade compliance & governance framework
Cold storage with 24x7 real-time availability
Zero central points of compromise
SOC 1 and ISO 27001

Zodia has Ecosystem assurance
Rigorous Coin Assessments & Provenance
Exchange due diligence
Ecosystem connectivity through Zodia Connect

Zodia is Agile and comprehensive
24/7 instant settlements
Coverage of > 80% of coin market cap
Innovative capabilities: liquidity pool access, staking, yield generation

Zodia cold wallets are called Zodia Protect
Your digital assets are always yours, at rest or in motion.

Registered with multiple regulatory bodies, certified and insured, our air-gapped cold storage security model is designed to maintain 24/7 availability of your digital assets while removing them from threat, exposure to unnecessary risk or potential loss. With anti-money laundering checks, asset quarantine and wallet address pre-screening, the integrity of your wallets and transfers is always ensured.

Cold storage security utilizing air gapped,
military grade HSM technology
Segregated client wallets aligning to UK
Client Asset Segregation Principles
Automated fraud detection and monitoring
on a transaction level basis
Bare trust structure and robust governance over resolution management – your assets are always yours even
in the event of Zodia Custody’s insolvency
Insurance coverage, including specific cyber insurance policy
Initial and on-going monitoring of both crypto assets
and trading venues / exchanges
Independent Ethical Hacking and Private Bug Bounty Programme
Zodia supports these coins

Supported coins, IMPORTANT: IF USER ASKS WHAT COINS ARE SUPPORTED GIVE FULL LIST!:
AVAX (Avalanche)

BAT (Basic Attention Token)

BAL (Balancer)

CHZ (Chiliz)

CRO (Cronos)

DYDX (Dydx)

ENS (Ethereum Name Service)

ENJ (Enjin)

FTM (Fantom)

GALA (Gala)

HT (Huobi Token)

KNC (Kyber Network Crystal)

MANA (Decentraland)

MKR (Maker)

OKB (OKX)

PAXG (Pax Gold)

QNT (Quant)

RNDR (Render)

SAND (Sandbox)

SNX (Synthetix)

YFI (Yearn Finance)

ZRX (0x Protocol)

Indexed coins:
AAVE (AAVE)

ADA (Cardano)

BCH (Bitcoin Cash)

BTC (Bitcoin)

COMP (Compound)

DOT (Polkadot)

ENA (Ethena)

ETH (Ethereum)

EURS (Stasis Euro)

LINK (Chainlink)

LTC (Litecoin)

MATIC (Polygon)

SOL (Solana)

TBILL (OpenEden TBILL)

UNI (Uniswap)

USDC (USD Circle)

USDE (USD Ethena)

USDM (USD Mountain Protocol)

USDT (USD Tether)

WBTC (Wrapped BTC)

XLM (Stellar)

XRP (Ripple)

So your digital assets will always be safe, traceable, investable and tradeable.

Current conversation:
{chat_history}

User: {input}
AI:`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    /**
     * You can also try e.g.:
     *
     * import { ChatAnthropic } from "@langchain/anthropic";
     * const model = new ChatAnthropic({});
     *
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */
    const model = new ChatOpenAI({
      temperature: 0.8,
      model: "gpt-3.5-turbo-0125",
    });

    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and byte-encoding.
     */
    const outputParser = new HttpResponseOutputParser();

    /**
     * Can also initialize as:
     *
     * import { RunnableSequence } from "@langchain/core/runnables";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */
    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
