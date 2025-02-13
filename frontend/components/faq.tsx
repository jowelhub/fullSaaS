import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqItems = [
  {
    question: "What is your SaaS product?",
    answer:
      "Our SaaS product is a comprehensive business solution that helps streamline workflows, improve productivity, and drive growth through advanced analytics and integrations.",
  },
  {
    question: "How does pricing work?",
    answer:
      "We offer tiered pricing plans to suit businesses of all sizes. Our plans are billed monthly or annually, with discounts for annual subscriptions. You can find detailed pricing information on our Pricing page.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 14-day free trial for all our plans. No credit card is required to start your trial.",
  },
  {
    question: "How secure is your platform?",
    answer:
      "Security is our top priority. We use bank-level encryption, regular security audits, and comply with industry standards to ensure your data is always protected.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.",
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
