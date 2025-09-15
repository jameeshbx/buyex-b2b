import Link from "next/link"
import Image from "next/image"

export default function terms() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <h1 className="text-4xl font-bold font-jakarta mb-4">Terms And Conditions</h1>
      {/* Divider line */}
      <div className="border-t mb-8"></div>
      
      {/* Reordered layout for mobile - TOC first */}
      <div className="block md:hidden mb-8">
        <div className="p-4  bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Table of Contents</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["#user-account", "User Account"],
              ["#services", "Services"],
              ["#agents-and-visitors", "Agents And Visitors"],
              ["#change", "Change"],
              ["#service-eligibility", "Service Eligibility"],
              ["#your-account", "Your Account"],
              ["#notices-messages", "Notices & Messages"],
              ["#dos", "Dos"],
              ["#donts", "Don'ts"],
              ["#refund-cancellation", "Refund and Cancellation"],
              ["#refund-eligibility", "Refund Eligibility"],
              ["#refund-processing-time", "Refund Processing Time"],
              ["#transaction-fees", "Transaction Fees"],
              ["#exchange-rate-fluctuations", "Exchange Rate Fluctuations"],
              ["#wire-transfer-rejection", "Wire Transfer Rejection"],
              ["#eligibility-refunds", "Eligibility for Refunds"],
              ["#refund-request-process", "Refund Request Process"],
              ["#refund-payment", "Refund Payment"],
              ["#changes-refund-policy", "Changes to Refund Policy"],
              ["#contact-us", "Contact us"]
            ].map(([href, label]) => (
              <div key={href} className="mb-2">
                <Link href={href} className="text-black hover:text-teal-800 flex items-start gap-2 font-jakarta text-sm">
                  <Image src="/stash.png" alt="" width={14} height={14} />
                  <span>{label}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="md:col-span-3 space-y-6 order-2 md:order-1">
          <div className="prose max-w-none text-gray-500 font-jakarta">
            <p>
              When you use our Services you agree to all of these terms. Your use of our Services is also subject to our Cookie Policy and our Privacy Policy, which covers how we collect, use, share, and store your personal information. To access certain features of the Portal, you may be required to create a user account. You agree to provide accurate and complete information when creating your account, and to keep your account information current and accurate at all times. You are responsible for maintaining the confidentiality of your account credentials, and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account or any other breach of security.
            </p>

            <h2 id="user-account" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
              USER ACCOUNT
            </h2>
           <p className="mb-4 text-gray-700">
  You agree that by clicking &quot;Sign Up&quot; or similar, registering, accessing or using our services (described below), you are agreeing to enter into a legally binding User Agreement with Buyex Forex. If you do not agree to this User Agreement (&quot;User Agreement&quot; or &quot;Agreement&quot;), do not click &quot;Sign Up&quot; or similar and do not access or otherwise use any of our Services. If you wish to terminate this User Agreement, at any time you can do so by giving a written notice prior 30 days and no longer accessing or using our Services.
</p>

<h2 id="services" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
  SERVICES
</h2>
<ol className="list-decimal pl-6 space-y-2">
  <li>This User Agreement applies to Buyex Forex and other services that state that they are offered under this User Agreement.</li>
  <li>You are entering into this User Agreement with Buyex Forex (also referred to as &quot;we&quot; and &quot;us&quot;).</li>
  <li>This User Agreement applies to Agents and Direct Customers.</li>
  <li>As a Visitor or Agent of our Services, the collection, use and sharing of your personal data is subject to the Privacy Policy and updates.</li>
</ol>

<h2 id="agents-visitors" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
  AGENTS AND VISITORS
</h2>
<ol start={5} className="list-decimal pl-6 space-y-2">
  <li>When you register and join the Buyex Forex Forex Agent Services, you become a Member. If you have chosen not to register for our Services, you may access certain features as a &quot;Visitor.&quot;</li>
</ol>

<h2 id="change" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
  CHANGE
</h2>
<ol start={6} className="list-decimal pl-6 space-y-2">
  <li>We may make changes to the User Agreement.</li>
  <li>We may modify this User Agreement, our Privacy Policy and our Cookies Policy from time to time. If you object to any changes, you may close your account. Your continued use of our Services after we publish or send a notice about our changes to these terms means that you are consenting to the updated terms as of their effective date.</li>
</ol>

<h2 id="service-eligibility" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
  SERVICE ELIGIBILITY
</h2>
<ol start={16} className="list-decimal pl-6 space-y-2">
  <li>
    You&apos;re okay with us providing notices and messages to you through our websites, apps, and contact information.
    If your contact information is out of date, you may miss out on important notices.
  </li>
  <li>
    You agree that we will provide notices and messages to you in the following ways:
    <ul className="list-disc pl-6 mt-2 space-y-1">
      <li>within the Service,</li>
      <li>
        sent to the contact information you provided us (e.g., email, mobile number, physical address).
        You agree to keep your contact information up to date.
      </li>
    </ul>
  </li>
</ol>

<h2 id="your-account" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
  YOUR ACCOUNT
</h2>
<ol start={12} className="list-decimal pl-6 space-y-2">
  <li>You will keep your password a secret.</li>
  <li>You will not share an account with anyone else and will follow our rules and the law.</li>
  <li>Members are account holders. You agree to:
    <ul className="list-disc pl-6 mt-2 space-y-1">
      <li>use a strong password and keep it confidential;</li>
      <li>not transfer any part of your account (e.g., connections);</li>
      <li>follow the law and our list of Dos and Don&#39;ts. You are responsible for anything that happens through your account unless you close it or report misuse.</li>
    </ul>
  </li>
</ol>

<h2 id="notices-messages" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
  NOTICES &amp; MESSAGES
</h2>
<ol start={16} className="list-decimal pl-6 space-y-2">
  <li>
    You&apos;re okay with us providing notices and messages to you through our websites, apps, and contact information.
    If your contact information is out of date, you may miss out on important notices.
  </li>
  <li>
    You agree that we will provide notices and messages to you in the following ways:
    <ul className="list-disc pl-6 mt-2 space-y-1">
      <li>within the Service,</li>
      <li>
        sent to the contact information you provided us (e.g., email, mobile number, physical address).
        You agree to keep your contact information up to date.
      </li>
    </ul>
  </li>
</ol>


<h2 id="dos" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
  DO&apos;S
</h2>
<ol start={18} className="list-decimal pl-6 space-y-2">
  <li>You agree that you will:
    <ul className="list-disc pl-6 mt-2 space-y-1">
      <li>Comply with all applicable laws and regulations</li>
      <li>Provide accurate information to us</li>
      <li>Keep your account information secure</li>
    </ul>
  </li>
</ol>

<h2 id="donts" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
  DON&apos;TS
</h2>
<ol start={19} className="list-decimal pl-6 space-y-2">
  <li>You agree that you will not:
    <ul className="list-disc pl-6 mt-2 space-y-1">
      <li>Create a false identity on Buyex Forex, misrepresent your identity, create an Agent profile for anyone other than yourself (a real person), or use or attempt to use another&#39;s account;</li>
      <li>Develop, support or use software, devices, scripts, robots or any other means or processes (including crawlers, browser plugins and add-ons or any other technology) to scrape the Services or otherwise copy profiles and other data from the Services;</li>
      <li>Override any security feature or bypass or circumvent any access controls or use limits of the Service (such as caps on keyword searches or profile views);</li>
      <li>Copy, use, disclose or distribute any information obtained from the Services, whether directly or through third parties (such as search engines), without the consent of Buyex Forex;</li>
      <li>Disclose information that you do not have the consent to disclose (such as confidential information of others (including your employees));</li>
      <li>Upload anything that contains software viruses, worms, or any other harmful code; Reverse engineer, decompile, disassemble, decipher or otherwise attempt to derive the source code for the Services or any related technology that is not open-source;</li>
      <li>Rent, lease, loan, trade, sell/re-sell or otherwise monetize the Services or related data or access to the same, without Buyex Forex&#39;s consent;</li>
      <li>Deep-link to our Services for any purpose other than to promote your profile or a Group on our Services, without Buyex Forex&#39;s consent;</li>
      <li>Use bots or other automated methods to access the Services;</li>
      <li>Interfere with the operation of, or place an unreasonable load on, the Services (e.g., spam, denial of service attack, viruses, gaming algorithms);</li>
    </ul>
  </li>
</ol>


            <h2 id="refund-cancellation" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
              REFUND AND CANCELLATION
            </h2>
            <p>
              At Buyex Forex we strive to provide our customers with the best possible service and experience when it comes to foreign exchange transactions. We understand that there may be situations where you need to cancel or modify your transaction, and we have created this refund policy to outline our process and guidelines for refunds. Cancellation and Modification Policy Once you have completed a transaction, you may not be able to cancel or modify it, as foreign exchange transactions are time-sensitive and volatile. However, if you contact our customer service team within 30 minutes of placing the order, we will try our best to accommodate your request.
            </p>

            <h2 id="refund-eligibility" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
              REFUND ELIGIBILITY
            </h2>
            <p>
              In general, we do not offer refunds for successfully completed transactions by our AD bank, unless the transaction was not executed as per the compliance instructions, or if there was an error on our part. If you have any questions or concerns about a completed transaction, please contact our customer service team at support@buyexchange.in. Refunds will generally be issued in the same currency and to the same account used for the original transaction. We may issue refunds in a different account in certain circumstances, such as if the original account is closed. All refunds are made to the original method of payment unless agreed explicitly by the end customer to credit to an alternate mode.
            </p>

            <h2 id="refund-processing-time" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
              REFUND PROCESSING TIME
            </h2>
            <p>
              If you are eligible for a refund, we will process it as quickly as possible. Refunds will typically be processed based on the customer request within 2-7 business days, depending on the payment method and the time it takes for the funds to clear. If the AD bank rejects your service request due to compliance, the refund will be automatically initiated from our end within 48 working hours of the rejection. And if you do not furnish the required documents needed to process the transaction, the placed order will be canceled automatically after 48 business hours and a refund will be initiated from our end to the account used for the original transaction.
            </p>

            <h2 id="transaction-fees" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
              TRANSACTION FEES
            </h2>
            <p>
              Please note that transaction fees are non-refundable, as they cover the costs of executing the transaction and are separate from the exchange rate.
            </p>

            <h2 id="exchange-rate-fluctuations" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
              EXCHANGE RATE FLUCTUATIONS
            </h2>
            <p>
              Exchange rates can fluctuate rapidly, which means that the exchange rate you received when you made a transaction may not be the same when you request a refund. We cannot be held responsible for any losses incurred due to changes in exchange rates.
            </p>

            <h2 id="wire-transfer-rejection" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
              WIRE TRANSFER REJECTION REFUND POLICY
            </h2>
            <p>
              We understand that wire transfers rejected by foreign banks can be frustrating, and we want to ensure that our customers are treated fairly in the event of such an occurrence. Here are our guidelines for refunds related to wire transfer rejections:
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900">
              ELIGIBILITY FOR REFUNDS
            </h3>
            <p>
              All the rejected Wire Transfer by foreign bank is eligible for a refund. Please note that we will not be responsible for any other losses or damages resulting from wire transfer rejections by foreign banks beyond our control, such as currency amount, currency exchange rate fluctuations or bank fees.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900">
              REFUND REQUEST PROCESS
            </h3>
            <p>
              You can initiate the refund request if the rejected wire transfer is received back with our AD bank. To request a refund due to wire transfer rejection, please contact our customer service department at support@buyexchange.in. We may require additional information or documentation to process the refund. We will generally process refunds within 2-4 business days of receiving your request.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900">
              REFUND PAYMENT
            </h3>
            <p>
              Refunds will be issued in the same form of payment used for the original transaction. If the original transaction was made with a bank transfer, we will issue the refund to the same account used for the original transaction.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900">
              CHANGES TO REFUND POLICY
            </h3>
            <p>
              We reserve the right to modify this refund policy at any time. Any changes will be effective immediately upon posting on our website or notifying you via email or other means. If you have any questions or concerns about our refund policy related to wire transfer rejections, please contact our customer service department at support@buyexchange.in
            </p>

            <h2 id="contact-us" className="text-xl font-semibold mt-8 mb-4 text-gray-900">
              CONTACT US
            </h2>
            <p className="text-black">
              For Tech Support:{" "}
              <a href="mailto:admin@buyexchange.in" className="text-black font-bold hover:underline">
                admin@buyexchange.in
              </a>
            </p>
            <p className="text-black">
              Call Us:{" "}
              <a href="tel:+919022243243" className="text-black font-bold hover:underline">
                +91 9022 243 243
              </a>
            </p>
          </div>
        </div>
        
        {/* Table of Contents Sidebar - Hidden on mobile, shown on md and above */}
        <div className="hidden  md:block md:col-span-1 order-1 md:order-2">
          <div className="sticky top-14 p-4 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Table of Contents</h3>
            <ul className="space-y-2">
              {[
                ["#user-account", "User Account"],
                ["#services", "Services"],
                ["#agents-and-visitors", "Agents And Visitors"],
                ["#change", "Change"],
                ["#service-eligibility", "Service Eligibility"],
                ["#your-account", "Your Account"],
                ["#notices-messages", "Notices & Messages"],
                ["#dos", "Dos"],
                ["#donts", "Don'ts"],
                ["#refund-cancellation", "Refund and Cancellation"],
                ["#refund-eligibility", "Refund Eligibility"],
                ["#refund-processing-time", "Refund Processing Time"],
                ["#transaction-fees", "Transaction Fees"],
                ["#exchange-rate-fluctuations", "Exchange Rate Fluctuations"],
                ["#wire-transfer-rejection", "Wire Transfer Rejection"],
                ["#eligibility-refunds", "Eligibility for Refunds"],
                ["#refund-request-process", "Refund Request Process"],
                ["#refund-payment", "Refund Payment"],
                ["#changes-refund-policy", "Changes to Refund Policy"],
                ["#contact-us", "Contact us"]
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-black hover:text-teal-800 flex items-center gap-2 font-jakarta text-sm">
                    <Image src="/stash.png" alt="" width={14} height={14} />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

     <div className="relative bg-medium-gray py-10 sm:py-6 lg:py-8 mt-10 px-4 sm:px-6 lg:px-8 rounded-xl">
           {/* Background image - hidden on small screens, visible on lg and above */}
           <div className="absolute inset-0 z-0 overflow-hidden hidden lg:block">
             <Image
               src="/blue.svg"
               alt="Background"
               className="object-cover object-center w-full"
               priority
               width={1250}
               height={100}
             />
           </div>
     
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-dark-blue font-playfair text-center sm:text-left">
         Get in touch
       </h2>
     
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
         {/* Sales Enquiries */}
         <div className="bg-white p-4 sm:p-0 sm:bg-transparent rounded-lg sm:rounded-none shadow-sm sm:shadow-none">
           <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-dark-blue font-jakarta">Sales Enquiries</h3>
           <div className="flex items-center gap-3 mb-2">
             <Image 
               src="/phone.png" 
               alt="Phone icon" 
               width={20} 
               height={20} 
               className="w-4 h-4 sm:w-5 sm:h-5" 
             />
             <p className="text-sm sm:text-base md:text-lg text-dark-blue font-jakarta">+919072243243</p>
           </div>
           <div className="flex items-center gap-3">
             <Image 
               src="/email.png" 
               alt="Email icon" 
               width={20} 
               height={20} 
               className="w-4 h-4 sm:w-5 sm:h-5" 
             />
             <p className="text-sm sm:text-base md:text-lg text-dark-blue font-jakarta">sales@buyexchange.in</p>
           </div>
         </div>
     
         {/* Forex Consultation */}
         <div className="bg-white p-4 sm:p-0 sm:bg-transparent rounded-lg sm:rounded-none shadow-sm sm:shadow-none">
           <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-dark-blue font-jakarta">Forex Consultation</h3>
           <div className="flex items-center gap-3 mb-2">
             <Image 
               src="/phone.png" 
               alt="Phone icon" 
               width={20} 
               height={20} 
               className="w-4 h-4 sm:w-5 sm:h-5" 
             />
             <p className="text-sm sm:text-base md:text-lg text-dark-blue font-jakarta">+919072243243</p>
           </div>
           <div className="flex items-center gap-3">
             <Image 
               src="/email.png" 
               alt="Email icon" 
               width={20} 
               height={20} 
               className="w-4 h-4 sm:w-5 sm:h-5" 
             />
             <p className="text-sm sm:text-base md:text-lg text-dark-blue font-jakarta">forex@buyexchange.in</p>
           </div>
         </div>
         
         {/* Empty div preserved for layout */}
         <div className="hidden lg:block"></div>
       </div>
     </div>
         </div>
         </div>
       )
     }