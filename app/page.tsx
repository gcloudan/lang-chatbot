import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        Hi I&apos;m Zodia Bot
      </h1>
      <ul>
        <li>
          <span className="ml-2">
          Zodia Custody is committed to protecting your privacy. We&apos;ll only use your personal information to provide the services requested from us.
          </span>
        </li>
        <li className="hidden text-l md:block">
          <span className="ml-2">
            This chatbot is a work in progress and no responses generated are endorsed by Zodia Custody.
          </span>
        </li>
        <li className="text-l">
          <span className="ml-2">
           All information is sourced from the official{" "}
            <a
              href="https://zodia.io/"
              target="_blank"
            >
              Zodia Website
            </a>
            {" "}try asking me some questions:
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            <code>Tell me more about Zodia&apos;s Staking solution?</code> below!
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            <code>How do I access the platform?</code> below!
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            <code>What coins are supported?</code> below!
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            <code>How can I create a transfer?</code> below!
          </span>
        </li>
      </ul>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/chat"
      emoji=""
      titleText=""
      placeholder="Tell me more about Zodia&apos;s staking solutions."
      emptyStateComponent={InfoCard}
    ></ChatWindow>
  );
}
